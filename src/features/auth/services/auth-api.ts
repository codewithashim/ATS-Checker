import { 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials, 
  ForgotPasswordData, 
  ResetPasswordData,
  User,
  AuthErrorCode,
  AuthErrorData
} from '../types';

export class AuthError extends Error {
  public readonly field?: string;
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly retryable?: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    options: Partial<AuthErrorData> = {}
  ) {
    super(message);
    this.name = 'AuthError';
    this.field = options.field;
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.retryable = options.retryable;
    this.details = options.details;
  }

  static fromResponse(response: Response, errorData?: any): AuthError {
    const statusCode = response.status;
    let code = AuthErrorCode.UNKNOWN_ERROR;
    let message = 'An error occurred';
    let retryable = false;

    switch (statusCode) {
      case 400:
        code = AuthErrorCode.VALIDATION_ERROR;
        message = errorData?.message || 'Invalid request';
        break;
      case 401:
        code = AuthErrorCode.INVALID_CREDENTIALS;
        message = errorData?.message || 'Invalid credentials';
        break;
      case 403:
        code = AuthErrorCode.PERMISSION_DENIED;
        message = errorData?.message || 'Access denied';
        break;
      case 404:
        code = AuthErrorCode.UNKNOWN_ERROR;
        message = 'Service not found';
        break;
      case 409:
        code = AuthErrorCode.EMAIL_ALREADY_EXISTS;
        message = errorData?.message || 'Email already exists';
        break;
      case 422:
        code = AuthErrorCode.VALIDATION_ERROR;
        message = errorData?.message || 'Validation failed';
        break;
      case 429:
        code = AuthErrorCode.RATE_LIMIT_EXCEEDED;
        message = errorData?.message || 'Too many requests';
        retryable = true;
        break;
      case 500:
        code = AuthErrorCode.SERVER_ERROR;
        message = 'Internal server error';
        retryable = true;
        break;
      case 503:
        code = AuthErrorCode.SERVICE_UNAVAILABLE;
        message = 'Service unavailable';
        retryable = true;
        break;
      default:
        if (statusCode >= 500) {
          retryable = true;
        }
    }

    return new AuthError(message, {
      code,
      statusCode,
      retryable,
      field: errorData?.field,
      details: errorData
    });
  }

  static fromNetworkError(error: Error): AuthError {
    return new AuthError('Network error occurred', {
      code: AuthErrorCode.NETWORK_ERROR,
      retryable: true,
      details: error.message
    });
  }

  static fromTimeoutError(): AuthError {
    return new AuthError('Request timed out', {
      code: AuthErrorCode.TIMEOUT_ERROR,
      retryable: true
    });
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class AuthAPI {
  private baseURL: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;
  private timeout: number = 30000;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const authError = AuthError.fromResponse(response, errorData);
        
        // Retry logic for retryable errors
        if (authError.retryable && retryCount < this.retryAttempts) {
          await this.delay(this.retryDelay * Math.pow(2, retryCount));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        
        throw authError;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw AuthError.fromTimeoutError();
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw AuthError.fromNetworkError(error);
      }
      
      // Retry logic for network errors
      if (retryCount < this.retryAttempts) {
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      
      throw AuthError.fromNetworkError(error as Error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  private async handleTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return false;
      }

      const response = await this.request<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
      }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      this.setToken(response.access_token);
      this.setRefreshToken(response.refresh_token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private setRefreshToken(refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('remember_me');
  }

  private setRememberMe(remember: boolean): void {
    if (typeof window === 'undefined') return;
    if (remember) {
      localStorage.setItem('remember_me', 'true');
    } else {
      localStorage.removeItem('remember_me');
    }
  }

  private getRateLimitAttempts(key: string): number {
    if (typeof window === 'undefined') return 0;
    const attempts = localStorage.getItem(key);
    if (!attempts) return 0;
    
    const data = JSON.parse(attempts);
    const now = Date.now();
    
    // Reset if older than 15 minutes
    if (now - data.timestamp > 15 * 60 * 1000) {
      localStorage.removeItem(key);
      return 0;
    }
    
    return data.count || 0;
  }

  private incrementRateLimitAttempts(key: string): void {
    if (typeof window === 'undefined') return;
    const attempts = this.getRateLimitAttempts(key);
    localStorage.setItem(key, JSON.stringify({
      count: attempts + 1,
      timestamp: Date.now()
    }));
  }

  private clearRateLimitAttempts(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate credentials before sending
      if (!credentials.email || !credentials.password) {
        throw new AuthError('Email and password are required', {
          code: AuthErrorCode.REQUIRED_FIELD_MISSING,
          field: !credentials.email ? 'email' : 'password'
        });
      }

      // Check for rate limiting
      const rateLimitKey = `login_attempts_${credentials.email}`;
      const attempts = this.getRateLimitAttempts(rateLimitKey);
      
      if (attempts >= 5) {
        throw new AuthError('Too many login attempts. Please try again later.', {
          code: AuthErrorCode.TOO_MANY_ATTEMPTS,
          retryable: true
        });
      }

      // Backend uses OAuth2PasswordRequestForm which expects form data
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Increment failed attempts
        this.incrementRateLimitAttempts(rateLimitKey);
        
        // Handle specific error cases
        if (response.status === 401) {
          throw new AuthError('Invalid email or password', {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            field: 'email',
            statusCode: 401
          });
        }
        
        if (response.status === 423) {
          throw new AuthError('Account is locked due to too many failed attempts', {
            code: AuthErrorCode.ACCOUNT_LOCKED,
            statusCode: 423
          });
        }
        
        if (response.status === 429) {
          throw new AuthError('Too many login attempts. Please wait before trying again.', {
            code: AuthErrorCode.RATE_LIMIT_EXCEEDED,
            retryable: true,
            statusCode: 429
          });
        }
        
        throw AuthError.fromResponse(response, errorData);
      }

      const tokenData = await response.json();
      
      // Clear rate limit on successful login
      this.clearRateLimitAttempts(rateLimitKey);
      
      // Validate token data
      if (!tokenData.access_token || !tokenData.refresh_token) {
        throw new AuthError('Invalid response from server', {
          code: AuthErrorCode.SERVER_ERROR
        });
      }
      
      // Transform backend response to frontend format
      const authResponse: AuthResponse = {
        user: {
          id: tokenData.user_id || '',
          name: tokenData.name || '',
          email: credentials.email,
          role: tokenData.role || 'job_seeker',
          is_email_verified: tokenData.is_email_verified || false,
          created_at: tokenData.created_at || new Date().toISOString(),
          updated_at: tokenData.updated_at || new Date().toISOString(),
        },
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
      };

      this.setToken(authResponse.access_token);
      this.setRefreshToken(authResponse.refresh_token);
      
      // Set remember me if requested
      if (credentials.rememberMe) {
        this.setRememberMe(true);
      }
      
      return authResponse;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw AuthError.fromNetworkError(error as Error);
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      // Validate credentials before sending
      if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
        throw new AuthError('All fields are required', {
          code: AuthErrorCode.REQUIRED_FIELD_MISSING,
          field: !credentials.name ? 'name' : !credentials.email ? 'email' : !credentials.password ? 'password' : 'confirmPassword'
        });
      }

      if (credentials.password !== credentials.confirmPassword) {
        throw new AuthError('Passwords do not match', {
          code: AuthErrorCode.VALIDATION_ERROR,
          field: 'confirmPassword'
        });
      }

      if (!credentials.acceptTerms) {
        throw new AuthError('You must accept the terms and conditions', {
          code: AuthErrorCode.TERMS_NOT_ACCEPTED,
          field: 'acceptTerms'
        });
      }

      // Check for rate limiting
      const rateLimitKey = `signup_attempts_${credentials.email}`;
      const attempts = this.getRateLimitAttempts(rateLimitKey);
      
      if (attempts >= 3) {
        throw new AuthError('Too many signup attempts. Please try again later.', {
          code: AuthErrorCode.TOO_MANY_ATTEMPTS,
          retryable: true
        });
      }

      const response = await this.request<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
        user: {
          id: string;
          name: string;
          email: string;
          role: string;
          is_email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
      }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          confirm_password: credentials.confirmPassword,
          role: credentials.role,
        }),
      });

      // Clear rate limit on successful signup
      this.clearRateLimitAttempts(rateLimitKey);

      // Validate response data
      if (!response.access_token || !response.refresh_token || !response.user) {
        throw new AuthError('Invalid response from server', {
          code: AuthErrorCode.SERVER_ERROR
        });
      }

      // Transform backend response to frontend format
      const authResponse: AuthResponse = {
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role as 'job_seeker' | 'recruiter',
          is_email_verified: response.user.is_email_verified,
          created_at: response.user.created_at,
          updated_at: response.user.updated_at,
        },
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        token_type: response.token_type,
        expires_in: response.expires_in,
      };

      this.setToken(authResponse.access_token);
      this.setRefreshToken(authResponse.refresh_token);
      return authResponse;
    } catch (error) {
      if (error instanceof AuthError) {
        // Increment failed attempts for signup
        if (error.code === AuthErrorCode.EMAIL_ALREADY_EXISTS || error.code === AuthErrorCode.VALIDATION_ERROR) {
          const rateLimitKey = `signup_attempts_${credentials.email}`;
          this.incrementRateLimitAttempts(rateLimitKey);
        }
        throw error;
      }
      throw AuthError.fromNetworkError(error as Error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Try to logout on server if we have a token
      if (this.getToken()) {
        await this.request('/auth/logout', {
          method: 'POST',
        });
      }
    } catch (error) {
      // Log error but don't throw - we still want to clear local tokens
      console.warn('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new AuthError('No refresh token available', {
          code: AuthErrorCode.TOKEN_INVALID
        });
      }

      // Check if refresh token is expired
      if (this.isTokenExpired(refreshToken)) {
        throw new AuthError('Refresh token has expired', {
          code: AuthErrorCode.TOKEN_EXPIRED
        });
      }

      const response = await this.request<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
      }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      // Validate response
      if (!response.access_token || !response.refresh_token) {
        throw new AuthError('Invalid refresh response from server', {
          code: AuthErrorCode.SERVER_ERROR
        });
      }

      // Get current user data to maintain user context
      let user: User | null = null;
      try {
        user = await this.getCurrentUser();
      } catch (error) {
        // If we can't get user data, we'll need to handle this gracefully
        console.warn('Could not get user data during token refresh:', error);
      }

      const authResponse: AuthResponse = {
        user: user || {
          id: '',
          name: '',
          email: '',
          role: 'job_seeker',
          is_email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        token_type: response.token_type,
        expires_in: response.expires_in,
      };

      this.setToken(authResponse.access_token);
      this.setRefreshToken(authResponse.refresh_token);
      return authResponse;
    } catch (error) {
      if (error instanceof AuthError) {
        // Clear tokens if refresh fails
        this.clearTokens();
        throw error;
      }
      throw AuthError.fromNetworkError(error as Error);
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    return await this.request('/auth/resend-verification', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new AuthError('No authentication token found', {
          code: AuthErrorCode.TOKEN_INVALID
        });
      }

      // Check if token is expired
      if (this.isTokenExpired(token)) {
        // Try to refresh token
        const refreshed = await this.handleTokenRefresh();
        if (!refreshed) {
          throw new AuthError('Authentication token has expired', {
            code: AuthErrorCode.TOKEN_EXPIRED
          });
        }
      }

      const response = await this.request<{
        id: string;
        name: string;
        email: string;
        role: string;
        is_email_verified: boolean;
        created_at: string;
        updated_at: string;
      }>('/auth/me');

      // Validate response data
      if (!response.id || !response.email) {
        throw new AuthError('Invalid user data received', {
          code: AuthErrorCode.SERVER_ERROR
        });
      }

      return {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role as 'job_seeker' | 'recruiter',
        is_email_verified: response.is_email_verified,
        created_at: response.created_at,
        updated_at: response.updated_at,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw AuthError.fromNetworkError(error as Error);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    if (this.isTokenExpired(token)) {
      // Clear expired token
      this.clearTokens();
      return false;
    }
    
    return true;
  }
}

// Export the real API instance
export const authAPI = new AuthAPI();

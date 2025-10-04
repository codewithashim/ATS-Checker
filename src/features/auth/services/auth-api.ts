import { 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials, 
  ForgotPasswordData, 
  ResetPasswordData,
  User
} from '../types';

export class AuthError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class AuthAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
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
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AuthError(
          errorData.message || 'An error occurred',
          errorData.field,
          errorData.code
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Network error occurred');
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
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
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
      throw new AuthError(
        errorData.detail || 'Login failed',
        'email',
        errorData.code
      );
    }

    const tokenData = await response.json();
    
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
    return authResponse;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
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
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new AuthError('No refresh token available');
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
    const response = await this.request<{
      id: string;
      name: string;
      email: string;
      role: string;
      is_email_verified: boolean;
      created_at: string;
      updated_at: string;
    }>('/auth/me');

    return {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role as 'job_seeker' | 'recruiter',
      is_email_verified: response.is_email_verified,
      created_at: response.created_at,
      updated_at: response.updated_at,
    };
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Export the real API instance
export const authAPI = new AuthAPI();

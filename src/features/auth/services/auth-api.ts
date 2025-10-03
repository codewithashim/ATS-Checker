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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    return response;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    return response;
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

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    return response;
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
    return await this.request('/auth/me');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Mock implementation for development
class MockAuthAPI extends AuthAPI {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          name: 'John Doe',
          email: credentials.email,
          role: 'job_seeker',
          isEmailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      };

      // Access private methods through the parent class
      (this as any).setToken(mockResponse.token);
      (this as any).setRefreshToken(mockResponse.refreshToken);
      return mockResponse;
    }

    throw new AuthError('Invalid credentials', 'email');
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    if (credentials.password !== credentials.confirmPassword) {
      throw new AuthError('Passwords do not match', 'confirmPassword');
    }

    if (credentials.password.length < 8) {
      throw new AuthError('Password must be at least 8 characters', 'password');
    }

    const mockResponse: AuthResponse = {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
    };

    // Access private methods through the parent class
    (this as any).setToken(mockResponse.token);
    (this as any).setRefreshToken(mockResponse.refreshToken);
    return mockResponse;
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    (this as any).clearTokens();
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Password reset email sent' };
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Verification email sent' };
  }

  async getCurrentUser(): Promise<User> {
    const token = (this as any).getToken();
    if (!token) {
      throw new AuthError('No authentication token');
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: '1',
      name: 'John Doe',
      email: 'test@example.com',
      role: 'job_seeker',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

// Export the appropriate API instance
export const authAPI = process.env.NODE_ENV === 'development' 
  ? new MockAuthAPI() 
  : new AuthAPI();

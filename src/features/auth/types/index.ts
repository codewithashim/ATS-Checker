export interface User {
  id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter';
  avatar?: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'job_seeker' | 'recruiter';
  acceptTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

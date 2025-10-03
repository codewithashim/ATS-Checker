import { 
  LoginCredentials, 
  SignupCredentials, 
  ForgotPasswordData, 
  ResetPasswordData,
  ValidationResult,
  FormFieldError 
} from '../types';

export class ValidationError extends Error {
  constructor(public errors: FormFieldError[]) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters';
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return 'Name can only contain letters and spaces';
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateLoginCredentials = (credentials: LoginCredentials): ValidationResult => {
  const errors: FormFieldError[] = [];

  const emailError = validateEmail(credentials.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  if (!credentials.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignupCredentials = (credentials: SignupCredentials): ValidationResult => {
  const errors: FormFieldError[] = [];

  const nameError = validateName(credentials.name);
  if (nameError) {
    errors.push({ field: 'name', message: nameError });
  }

  const emailError = validateEmail(credentials.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  const passwordError = validatePassword(credentials.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  const confirmPasswordError = validateConfirmPassword(credentials.password, credentials.confirmPassword);
  if (confirmPasswordError) {
    errors.push({ field: 'confirmPassword', message: confirmPasswordError });
  }

  if (!credentials.role) {
    errors.push({ field: 'role', message: 'Please select a role' });
  }

  if (!credentials.acceptTerms) {
    errors.push({ field: 'acceptTerms', message: 'You must accept the terms and conditions' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateForgotPasswordData = (data: ForgotPasswordData): ValidationResult => {
  const errors: FormFieldError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateResetPasswordData = (data: ResetPasswordData): ValidationResult => {
  const errors: FormFieldError[] = [];

  if (!data.token) {
    errors.push({ field: 'token', message: 'Reset token is required' });
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) {
    errors.push({ field: 'confirmPassword', message: confirmPasswordError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getFieldError = (errors: FormFieldError[], field: string): string | null => {
  const error = errors.find(err => err.field === field);
  return error ? error.message : null;
};

export const hasFieldError = (errors: FormFieldError[], field: string): boolean => {
  return errors.some(err => err.field === field);
};

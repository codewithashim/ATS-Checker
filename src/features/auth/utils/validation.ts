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
  if (!email) {
    return 'Email is required';
  }
  
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return 'Email is required';
  }
  
  // Check for common email issues
  if (trimmedEmail.length > 254) {
    return 'Email address is too long';
  }
  
  if (trimmedEmail.includes('..')) {
    return 'Email address cannot contain consecutive dots';
  }
  
  if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return 'Email address cannot start or end with a dot';
  }
  
  // More comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }
  
  // Check for suspicious patterns
  if (trimmedEmail.includes('+') && !trimmedEmail.includes('@')) {
    return 'Email address format is invalid';
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  // Check minimum length
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  // Check maximum length (prevent DoS attacks)
  if (password.length > 128) {
    return 'Password is too long (maximum 128 characters)';
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    return 'This password is too common. Please choose a stronger password';
  }
  
  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) {
    return 'Password cannot contain more than 2 consecutive identical characters';
  }
  
  // Check for keyboard patterns
  const keyboardPatterns = [
    'qwerty', 'asdfgh', 'zxcvbn', '123456', 'abcdef'
  ];
  
  for (const pattern of keyboardPatterns) {
    if (password.toLowerCase().includes(pattern)) {
      return 'Password contains common keyboard patterns. Please choose a more secure password';
    }
  }
  
  // Check character requirements
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
  
  // Check for spaces
  if (password.includes(' ')) {
    return 'Password cannot contain spaces';
  }
  
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  
  const trimmedName = name.trim();
  if (!trimmedName) {
    return 'Name is required';
  }
  
  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (trimmedName.length > 50) {
    return 'Name must be less than 50 characters';
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    return 'Name cannot contain multiple consecutive spaces';
  }
  
  // Check for names that start or end with spaces, hyphens, or apostrophes
  if (/^[\s\-']|[\s\-']$/.test(trimmedName)) {
    return 'Name cannot start or end with spaces, hyphens, or apostrophes';
  }
  
  // Check for suspicious patterns (too many special characters)
  const specialCharCount = (trimmedName.match(/[\-']/g) || []).length;
  if (specialCharCount > 2) {
    return 'Name contains too many special characters';
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

  // Sanitize email input
  const sanitizedEmail = sanitizeInput(credentials.email);

  const emailError = validateEmail(sanitizedEmail);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  if (!credentials.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  // Additional security validations
  const emailScriptError = validateNoScripts(sanitizedEmail, 'Email');
  if (emailScriptError) {
    errors.push({ field: 'email', message: emailScriptError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignupCredentials = (credentials: SignupCredentials): ValidationResult => {
  const errors: FormFieldError[] = [];

  // Sanitize inputs
  const sanitizedName = sanitizeInput(credentials.name);
  const sanitizedEmail = sanitizeInput(credentials.email);

  // Validate name
  const nameError = validateName(sanitizedName);
  if (nameError) {
    errors.push({ field: 'name', message: nameError });
  }

  // Validate email
  const emailError = validateEmail(sanitizedEmail);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  // Validate password
  const passwordError = validatePassword(credentials.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  // Validate password confirmation
  const confirmPasswordError = validatePasswordMatch(credentials.password, credentials.confirmPassword);
  if (confirmPasswordError) {
    errors.push({ field: 'confirmPassword', message: confirmPasswordError });
  }

  // Validate role
  const roleError = validateRole(credentials.role);
  if (roleError) {
    errors.push({ field: 'role', message: roleError });
  }

  // Validate terms acceptance
  const termsError = validateTermsAcceptance(credentials.acceptTerms);
  if (termsError) {
    errors.push({ field: 'acceptTerms', message: termsError });
  }

  // Additional security validations
  const nameHtmlError = validateNoHtmlTags(sanitizedName, 'Name');
  if (nameHtmlError) {
    errors.push({ field: 'name', message: nameHtmlError });
  }

  const nameScriptError = validateNoScripts(sanitizedName, 'Name');
  if (nameScriptError) {
    errors.push({ field: 'name', message: nameScriptError });
  }

  const emailScriptError = validateNoScripts(sanitizedEmail, 'Email');
  if (emailScriptError) {
    errors.push({ field: 'email', message: emailScriptError });
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

// Additional validation functions for edge cases
export const validateRole = (role: string): string | null => {
  if (!role) {
    return 'Role is required';
  }
  
  const validRoles = ['job_seeker', 'recruiter'];
  if (!validRoles.includes(role)) {
    return 'Please select a valid role';
  }
  
  return null;
};

export const validateTermsAcceptance = (accepted: boolean): string | null => {
  if (!accepted) {
    return 'You must accept the terms and conditions';
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>]/g, ''); // Remove potential HTML tags
};

export const validateInputLength = (input: string, fieldName: string, minLength: number, maxLength: number): string | null => {
  if (!input) {
    return `${fieldName} is required`;
  }
  
  const trimmed = input.trim();
  if (trimmed.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  
  if (trimmed.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  
  return null;
};

export const validateNoSpecialCharacters = (input: string, fieldName: string): string | null => {
  if (!input) return null;
  
  // Allow letters, numbers, spaces, hyphens, apostrophes, and periods
  if (!/^[a-zA-Z0-9\s\-'.]+$/.test(input)) {
    return `${fieldName} contains invalid characters`;
  }
  
  return null;
};

export const validateNoHtmlTags = (input: string, fieldName: string): string | null => {
  if (!input) return null;
  
  if (/<[^>]*>/g.test(input)) {
    return `${fieldName} cannot contain HTML tags`;
  }
  
  return null;
};

export const validateNoScripts = (input: string, fieldName: string): string | null => {
  if (!input) return null;
  
  const scriptPatterns = [
    /javascript:/i,
    /vbscript:/i,
    /onload/i,
    /onerror/i,
    /onclick/i,
    /onmouseover/i,
    /<script/i,
    /<\/script/i
  ];
  
  for (const pattern of scriptPatterns) {
    if (pattern.test(input)) {
      return `${fieldName} contains potentially harmful content`;
    }
  }
  
  return null;
};

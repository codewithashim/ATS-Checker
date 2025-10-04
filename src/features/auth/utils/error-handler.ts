import { AuthErrorCode } from '../types';
import { AuthError } from '../services/auth-api';

export interface ErrorDisplayInfo {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
  retryable: boolean;
}

export class AuthErrorHandler {
  static getErrorDisplayInfo(error: AuthError): ErrorDisplayInfo {
    switch (error.code) {
      case AuthErrorCode.NETWORK_ERROR:
        return {
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          type: 'error',
          retryable: true,
          action: {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        };

      case AuthErrorCode.TIMEOUT_ERROR:
        return {
          title: 'Request Timeout',
          message: 'The request took too long to complete. Please try again.',
          type: 'error',
          retryable: true
        };

      case AuthErrorCode.INVALID_CREDENTIALS:
        return {
          title: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
          type: 'error',
          retryable: false
        };

      case AuthErrorCode.ACCOUNT_LOCKED:
        return {
          title: 'Account Locked',
          message: 'Your account has been temporarily locked due to multiple failed login attempts. Please contact support or try again later.',
          type: 'error',
          retryable: true,
          action: {
            label: 'Contact Support',
            onClick: () => window.open('mailto:support@example.com')
          }
        };

      case AuthErrorCode.ACCOUNT_DISABLED:
        return {
          title: 'Account Disabled',
          message: 'Your account has been disabled. Please contact support for assistance.',
          type: 'error',
          retryable: false,
          action: {
            label: 'Contact Support',
            onClick: () => window.open('mailto:support@example.com')
          }
        };

      case AuthErrorCode.ACCOUNT_NOT_VERIFIED:
        return {
          title: 'Email Not Verified',
          message: 'Please verify your email address before signing in. Check your inbox for a verification email.',
          type: 'warning',
          retryable: false,
          action: {
            label: 'Resend Verification',
            onClick: () => {
              // This would trigger a resend verification email
              console.log('Resend verification email');
            }
          }
        };

      case AuthErrorCode.TOKEN_EXPIRED:
        return {
          title: 'Session Expired',
          message: 'Your session has expired. Please sign in again.',
          type: 'info',
          retryable: false,
          action: {
            label: 'Sign In',
            onClick: () => window.location.href = '/auth/login'
          }
        };

      case AuthErrorCode.EMAIL_ALREADY_EXISTS:
        return {
          title: 'Email Already Exists',
          message: 'An account with this email address already exists. Please sign in instead or use a different email.',
          type: 'error',
          retryable: false,
          action: {
            label: 'Sign In',
            onClick: () => window.location.href = '/auth/login'
          }
        };

      case AuthErrorCode.WEAK_PASSWORD:
        return {
          title: 'Weak Password',
          message: 'The password you entered is too weak. Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.',
          type: 'error',
          retryable: false
        };

      case AuthErrorCode.RATE_LIMIT_EXCEEDED:
        return {
          title: 'Too Many Requests',
          message: 'You have made too many requests. Please wait a moment before trying again.',
          type: 'warning',
          retryable: true
        };

      case AuthErrorCode.TOO_MANY_ATTEMPTS:
        return {
          title: 'Too Many Attempts',
          message: 'You have made too many failed attempts. Please wait before trying again.',
          type: 'warning',
          retryable: true
        };

      case AuthErrorCode.SERVER_ERROR:
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later or contact support if the problem persists.',
          type: 'error',
          retryable: true,
          action: {
            label: 'Contact Support',
            onClick: () => window.open('mailto:support@example.com')
          }
        };

      case AuthErrorCode.SERVICE_UNAVAILABLE:
        return {
          title: 'Service Unavailable',
          message: 'Our service is temporarily unavailable. Please try again later.',
          type: 'error',
          retryable: true
        };

      case AuthErrorCode.VALIDATION_ERROR:
        return {
          title: 'Validation Error',
          message: error.message || 'Please check your input and try again.',
          type: 'error',
          retryable: false
        };

      case AuthErrorCode.PERMISSION_DENIED:
        return {
          title: 'Access Denied',
          message: 'You do not have permission to perform this action.',
          type: 'error',
          retryable: false
        };

      case AuthErrorCode.SUSPICIOUS_ACTIVITY:
        return {
          title: 'Suspicious Activity Detected',
          message: 'We detected suspicious activity on your account. Please contact support immediately.',
          type: 'error',
          retryable: false,
          action: {
            label: 'Contact Support',
            onClick: () => window.open('mailto:security@example.com')
          }
        };

      case AuthErrorCode.IP_BLOCKED:
        return {
          title: 'Access Blocked',
          message: 'Your IP address has been blocked. Please contact support if you believe this is an error.',
          type: 'error',
          retryable: false,
          action: {
            label: 'Contact Support',
            onClick: () => window.open('mailto:support@example.com')
          }
        };

      default:
        return {
          title: 'Error',
          message: error.message || 'An unexpected error occurred. Please try again.',
          type: 'error',
          retryable: error.retryable || false
        };
    }
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    return delay + jitter;
  }

  static shouldRetry(error: AuthError, attempt: number, maxAttempts: number = 3): boolean {
    if (attempt >= maxAttempts) return false;
    if (!error.retryable) return false;
    
    // Don't retry certain error types
    const nonRetryableCodes = [
      AuthErrorCode.INVALID_CREDENTIALS,
      AuthErrorCode.ACCOUNT_DISABLED,
      AuthErrorCode.ACCOUNT_NOT_VERIFIED,
      AuthErrorCode.EMAIL_ALREADY_EXISTS,
      AuthErrorCode.WEAK_PASSWORD,
      AuthErrorCode.VALIDATION_ERROR,
      AuthErrorCode.PERMISSION_DENIED,
      AuthErrorCode.SUSPICIOUS_ACTIVITY,
      AuthErrorCode.IP_BLOCKED
    ];
    
    return !nonRetryableCodes.includes(error.code as AuthErrorCode);
  }

  static logError(error: AuthError, context?: string): void {
    const errorInfo = {
      code: error.code,
      message: error.message,
      field: error.field,
      statusCode: error.statusCode,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth Error:', errorInfo);
    }

    // In production, you might want to send this to a logging service
    // Example: sendToLoggingService(errorInfo);
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AuthError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof AuthError) {
    return AuthErrorHandler.shouldRetry(error, 0);
  }
  
  return false;
};

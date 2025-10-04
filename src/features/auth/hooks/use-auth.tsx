"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, SignupCredentials, AuthContextType, AuthErrorCode } from '../types';
import { authAPI, AuthError } from '../services/auth-api';
import { SessionManager } from '../utils/session-manager';
import { AuthErrorHandler } from '../utils/error-handler';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error when user starts typing or performing actions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for existing session
        const session = SessionManager.getSession();
        if (session && !SessionManager.isSessionExpired(session)) {
          setUser(session.user);
          SessionManager.updateLastActivity();
        } else if (authAPI.isAuthenticated()) {
          // Try to get current user if session is not available but token exists
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
          await SessionManager.createSession(currentUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        
        if (error instanceof AuthError) {
          AuthErrorHandler.logError(error, 'checkAuth');
          
          // Handle specific error cases
          if (error.code === AuthErrorCode.TOKEN_EXPIRED || 
              error.code === AuthErrorCode.TOKEN_INVALID) {
            // Clear invalid tokens silently
            SessionManager.clearSession();
            authAPI.logout();
          } else {
            setError(error.message);
          }
        } else {
          setError('Failed to check authentication status');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Initialize session manager
    SessionManager.initialize();
    
    // Cleanup on unmount
    return () => {
      SessionManager.cleanup();
    };
  }, []);

  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const credentials: LoginCredentials = { 
        email, 
        password, 
        rememberMe: rememberMe || false 
      };
      const response = await authAPI.login(credentials);
      setUser(response.user);
      await SessionManager.createSession(response.user);
      setError(null);
    } catch (error) {
      console.error('Sign in error:', error);
      
      if (error instanceof AuthError) {
        // Handle specific error cases
        if (error.code === AuthErrorCode.ACCOUNT_LOCKED) {
          setError('Your account has been locked due to too many failed attempts. Please contact support.');
        } else if (error.code === AuthErrorCode.ACCOUNT_NOT_VERIFIED) {
          setError('Please verify your email address before signing in.');
        } else if (error.code === AuthErrorCode.TOO_MANY_ATTEMPTS) {
          setError('Too many login attempts. Please wait before trying again.');
        } else if (error.code === AuthErrorCode.RATE_LIMIT_EXCEEDED) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, role: 'job_seeker' | 'recruiter' = 'job_seeker') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const credentials: SignupCredentials = {
        name,
        email,
        password,
        confirmPassword: password,
        role,
        acceptTerms: true,
      };
      const response = await authAPI.signup(credentials);
      setUser(response.user);
      await SessionManager.createSession(response.user);
      setError(null);
    } catch (error) {
      console.error('Sign up error:', error);
      
      if (error instanceof AuthError) {
        // Handle specific error cases
        if (error.code === AuthErrorCode.EMAIL_ALREADY_EXISTS) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (error.code === AuthErrorCode.WEAK_PASSWORD) {
          setError('Password is too weak. Please choose a stronger password.');
        } else if (error.code === AuthErrorCode.TERMS_NOT_ACCEPTED) {
          setError('You must accept the terms and conditions to create an account.');
        } else if (error.code === AuthErrorCode.TOO_MANY_ATTEMPTS) {
          setError('Too many signup attempts. Please wait before trying again.');
        } else if (error.code === AuthErrorCode.RATE_LIMIT_EXCEEDED) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authAPI.logout();
      SessionManager.clearSession();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if logout fails on server, clear local state
      SessionManager.clearSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (authAPI.isAuthenticated()) {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
        setError(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      
      if (error instanceof AuthError) {
        if (error.code === AuthErrorCode.TOKEN_EXPIRED || 
            error.code === AuthErrorCode.TOKEN_INVALID) {
          // Clear invalid tokens and user state
          authAPI.logout();
          setUser(null);
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to refresh user data');
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn,
    signOut,
    signUp,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

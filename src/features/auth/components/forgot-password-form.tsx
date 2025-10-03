'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ForgotPasswordData, FormFieldError } from '../types';
import { validateForgotPasswordData, getFieldError } from '../utils/validation';
import { authAPI, AuthError } from '../services/auth-api';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormFieldError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const handleInputChange = (field: keyof ForgotPasswordData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== field));
    }
    
    // Clear alert when user starts typing
    if (alert) {
      setAlert(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    // Validate form
    const validation = validateForgotPasswordData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgotPassword(formData);
      setIsSubmitted(true);
      setAlert({ type: 'success', message: 'Password reset email sent! Check your inbox.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error instanceof AuthError) {
        if (error.field) {
          setErrors([{ field: error.field, message: error.message }]);
        } else {
          setAlert({ type: 'error', message: error.message });
        }
      } else {
        setAlert({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-brand-success to-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Check your email</CardTitle>
          <CardDescription className="text-gray-700">
            We've sent a password reset link to <strong className="text-brand-primary">{formData.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="success" className="border-0 shadow-sm">
            <AlertDescription className="text-sm text-gray-700">
              If you don't see the email, check your spam folder or try again.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Try different email
            </Button>
            <Button asChild variant="ghost" className="w-full h-11 text-brand-primary hover:text-brand-primary-dark hover:bg-brand-primary/10 transition-all duration-200">
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          Forgot password?
        </CardTitle>
        <CardDescription className="text-center text-gray-700">
          Enter your email address and we'll send you a secure link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {alert && (
            <Alert 
              variant={alert.type === 'error' ? 'destructive' : 'success'}
              className="border-0 shadow-sm"
            >
              <AlertDescription className="text-sm">{alert.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary/60 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!getFieldError(errors, 'email')}
                disabled={isLoading}
                className="pl-10 h-11 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
              />
            </div>
            {getFieldError(errors, 'email') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError(errors, 'email')}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-700">
              Remember your password?{' '}
              <Link
                href="/auth/login"
                className="text-brand-primary hover:text-brand-primary-dark hover:underline transition-colors duration-200 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We've sent a password reset link to <strong>{formData.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="success">
            <AlertDescription>
              If you don't see the email, check your spam folder or try again.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Try different email
            </Button>
            <Button asChild variant="ghost" className="w-full">
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Forgot password?</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {alert && (
            <Alert variant={alert.type === 'error' ? 'destructive' : 'success'}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" required error={!!getFieldError(errors, 'email')}>
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!getFieldError(errors, 'email')}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
            {getFieldError(errors, 'email') && (
              <p className="text-sm text-red-600">{getFieldError(errors, 'email')}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <div className="text-center text-sm">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

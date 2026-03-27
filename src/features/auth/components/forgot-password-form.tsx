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
      <div className="w-full max-w-sm mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-4 pt-8">
            <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Check your email</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              We've sent a reset link to <strong className="text-blue-600">{formData.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            <Alert variant="success" className="border-0 shadow-sm">
              <AlertDescription className="text-xs text-gray-700">
                If you don't see the email, check your spam folder or try again.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm"
              >
                Try different email
              </Button>
              <Button asChild variant="ghost" className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 text-sm">
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 pb-4 pt-8">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-sm">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {alert && (
              <Alert 
                variant={alert.type === 'error' ? 'destructive' : 'success'}
                className="border-0 shadow-sm text-sm"
              >
                <AlertDescription className="text-xs">{alert.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!getFieldError(errors, 'email')}
                  disabled={isLoading}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              {getFieldError(errors, 'email') && (
                <p className="text-xs text-red-600">{getFieldError(errors, 'email')}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
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

            <div className="text-center pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Remember your password?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

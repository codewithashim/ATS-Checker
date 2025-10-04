'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginCredentials, FormFieldError } from '../types';
import { validateLoginCredentials, getFieldError } from '../utils/validation';
import { authAPI, AuthError } from '../services/auth-api';
import { Eye, EyeOff, Loader2, Mail, Lock, Github, Chrome } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { signIn, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormFieldError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== field));
    }
    
    // Clear alert and auth error when user starts typing
    if (alert) {
      setAlert(null);
    }
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    clearError();

    // Validate form
    const validation = validateLoginCredentials(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password, formData.rememberMe);
      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
      
      // Redirect after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      
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

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      // TODO: Implement social authentication
      console.log(`Signing in with ${provider}`);
      // For now, just show a message
      setAlert({ type: 'success', message: `${provider} authentication coming soon!` });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to sign in with ${provider}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 pb-4 pt-8">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-sm">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 space-y-4">
          {/* Social Login Buttons - More compact */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Divider - More subtle */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(alert || authError) && (
              <Alert 
                variant={(alert?.type === 'error' || authError) ? 'destructive' : 'success'}
                className="border-0 shadow-sm text-sm"
              >
                <AlertDescription className="text-xs">
                  {authError || alert?.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                Email
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

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!getFieldError(errors, 'password')}
                  disabled={isLoading}
                  className="pl-10 pr-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {getFieldError(errors, 'password') && (
                <p className="text-xs text-red-600">{getFieldError(errors, 'password')}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between py-1">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                label="Remember me"
                disabled={isLoading}
                className="text-xs"
              />
              <Link
                href="/auth/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

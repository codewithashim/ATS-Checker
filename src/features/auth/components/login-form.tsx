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
  const { signIn } = useAuth();
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
    
    // Clear alert when user starts typing
    if (alert) {
      setAlert(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    // Validate form
    const validation = validateLoginCredentials(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
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
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Social Login Buttons */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading}
          >
            <Github className="w-5 h-5 mr-3" />
            Continue with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {alert && (
            <Alert 
              variant={alert.type === 'error' ? 'destructive' : 'success'}
              className="border-0 shadow-sm"
            >
              <AlertDescription className="text-sm">{alert.message}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
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

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={!!getFieldError(errors, 'password')}
                disabled={isLoading}
                className="pl-10 pr-10 h-11 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
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
              <p className="text-sm text-red-600 mt-1">{getFieldError(errors, 'password')}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
              label="Remember me"
              disabled={isLoading}
              className="text-sm"
            />
            <Link
              href="/auth/forgot-password"
              className="text-sm text-brand-primary hover:text-brand-primary-dark hover:underline transition-colors duration-200 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
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
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-brand-primary hover:text-brand-primary-dark hover:underline transition-colors duration-200 font-medium"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

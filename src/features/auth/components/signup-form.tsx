'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SignupCredentials, FormFieldError } from '../types';
import { validateSignupCredentials, getFieldError } from '../utils/validation';
import { authAPI, AuthError } from '../services/auth-api';
import { Eye, EyeOff, Loader2, User, Mail, Lock, Shield, Github, Chrome, CheckCircle, AlertCircle, X } from 'lucide-react';

const roleOptions = [
  { value: 'job_seeker', label: 'Job Seeker' },
  { value: 'recruiter', label: 'Recruiter' },
];

export function SignupForm() {
  const router = useRouter();
  const { signUp, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormFieldError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const calculatePasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    
    setPasswordChecks(checks);
    
    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
  };

  const handleInputChange = (field: keyof SignupCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Calculate password strength when password changes
    if (field === 'password' && typeof value === 'string') {
      calculatePasswordStrength(value);
    }
    
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

  const handleSocialSignup = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      // TODO: Implement social authentication
      console.log(`Signing up with ${provider}`);
      // For now, just show a message
      setAlert({ type: 'success', message: `${provider} signup coming soon!` });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to sign up with ${provider}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    clearError();

    // Validate form
    const validation = validateSignupCredentials(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.name, formData.email, formData.password, formData.role);
      setAlert({ type: 'success', message: 'Account created successfully! Redirecting...' });
      
      // Redirect after successful signup
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Signup error:', error);
      
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-brand-danger';
    if (passwordStrength <= 3) return 'bg-brand-warning';
    if (passwordStrength <= 4) return 'bg-brand-primary';
    return 'bg-brand-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 pb-4 pt-8">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create account
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-sm">
            Join thousands of professionals
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 space-y-4">
          {/* Social Signup Buttons - More compact */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm"
              onClick={() => handleSocialSignup('google')}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm"
              onClick={() => handleSocialSignup('github')}
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

          <form onSubmit={handleSubmit} className="space-y-3">
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

            {/* Full Name Field */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-medium text-gray-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!getFieldError(errors, 'name')}
                  disabled={isLoading}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              {getFieldError(errors, 'name') && (
                <p className="text-xs text-red-600">{getFieldError(errors, 'name')}</p>
              )}
            </div>

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
                  placeholder="john@example.com"
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

            {/* Role Selection */}
            <div className="space-y-1">
              <Label htmlFor="role" className="text-xs font-medium text-gray-700">
                I am a
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <Select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as 'job_seeker' | 'recruiter')}
                  options={roleOptions}
                  placeholder="Select role"
                  error={!!getFieldError(errors, 'role')}
                  disabled={isLoading}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-gray-900"
                />
              </div>
              {getFieldError(errors, 'role') && (
                <p className="text-xs text-red-600">{getFieldError(errors, 'role')}</p>
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
                  placeholder="Create password"
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
              
              {/* Password Strength Indicator - Compact */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </div>
              )}
              
              {getFieldError(errors, 'password') && (
                <p className="text-xs text-red-600">{getFieldError(errors, 'password')}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!getFieldError(errors, 'confirmPassword')}
                  disabled={isLoading}
                  className="pl-10 pr-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {getFieldError(errors, 'confirmPassword') && (
                <p className="text-xs text-red-600">{getFieldError(errors, 'confirmPassword')}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-1">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange('acceptTerms', !!checked)}
                label="I agree to the Terms of Service and Privacy Policy"
                error={!!getFieldError(errors, 'acceptTerms')}
                disabled={isLoading}
                className="text-xs"
              />
              {getFieldError(errors, 'acceptTerms') && (
                <p className="text-xs text-red-600">{getFieldError(errors, 'acceptTerms')}</p>
              )}
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

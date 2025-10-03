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
  const { signUp } = useAuth();
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
    
    // Clear alert when user starts typing
    if (alert) {
      setAlert(null);
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

    // Validate form
    const validation = validateSignupCredentials(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.name, formData.email, formData.password);
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
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          Create your account
        </CardTitle>
        <CardDescription className="text-center text-gray-700">
          Join thousands of professionals optimizing their careers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Social Signup Buttons */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            onClick={() => handleSocialSignup('google')}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-3" />
            Sign up with Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            onClick={() => handleSocialSignup('github')}
            disabled={isLoading}
          >
            <Github className="w-5 h-5 mr-3" />
            Sign up with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-600">Or continue with email</span>
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

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary/60 w-4 h-4" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!getFieldError(errors, 'name')}
                disabled={isLoading}
                className="pl-10 h-11 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
              />
            </div>
            {getFieldError(errors, 'name') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError(errors, 'name')}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary/60 w-4 h-4" />
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

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-900">
              I am a
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary/60 w-4 h-4 z-10" />
              <Select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as 'job_seeker' | 'recruiter')}
                options={roleOptions}
                placeholder="Select your role"
                error={!!getFieldError(errors, 'role')}
                disabled={isLoading}
                className="pl-10 h-11 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
              />
            </div>
            {getFieldError(errors, 'role') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError(errors, 'role')}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-900">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary/60 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={!!getFieldError(errors, 'password')}
                disabled={isLoading}
                className="pl-10 pr-10 h-11 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary/60 hover:text-brand-primary transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-brand-primary">
                    {getPasswordStrengthText()}
                  </span>
                </div>
                
                {/* Password Requirements */}
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'lowercase', text: 'One lowercase letter' },
                    { key: 'uppercase', text: 'One uppercase letter' },
                    { key: 'number', text: 'One number' },
                    { key: 'special', text: 'One special character' },
                  ].map(({ key, text }) => (
                    <div key={key} className="flex items-center space-x-2 text-xs">
                      {passwordChecks[key as keyof typeof passwordChecks] ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={passwordChecks[key as keyof typeof passwordChecks] ? 'text-brand-success' : 'text-gray-600'}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {getFieldError(errors, 'password') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError(errors, 'password')}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary/60 w-4 h-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={!!getFieldError(errors, 'confirmPassword')}
                disabled={isLoading}
                className="pl-10 pr-10 h-11 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary/60 hover:text-brand-primary transition-colors duration-200"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {getFieldError(errors, 'confirmPassword') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError(errors, 'confirmPassword')}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleInputChange('acceptTerms', !!checked)}
              label="I agree to the Terms of Service and Privacy Policy"
              error={!!getFieldError(errors, 'acceptTerms')}
              disabled={isLoading}
              className="text-sm"
            />
            {getFieldError(errors, 'acceptTerms') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError(errors, 'acceptTerms')}</p>
            )}
          </div>

          {/* Create Account Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-secondary-dark hover:to-brand-primary-dark text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
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
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-700">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-brand-primary hover:text-brand-primary-dark hover:underline transition-colors duration-200 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

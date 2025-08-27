'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Eye, EyeOff, Chrome, Apple } from 'lucide-react';
import { AuthFormData, AuthMode, ThirdPartyProvider } from '../types/user';

interface AccountCreationProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export function AccountCreation({ onSuccess, onError }: AccountCreationProps) {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: '1',
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onSuccess?.(mockUser);
    } catch (error) {
      onError?.('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThirdPartyAuth = async (provider: ThirdPartyProvider) => {
    setIsLoading(true);
    try {
      // Simulate third-party auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: '1',
        email: `user@${provider}.com`,
        firstName: 'User',
        lastName: 'Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onSuccess?.(mockUser);
    } catch (error) {
      onError?.(`${provider} authentication failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AuthFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card 
        className="shadow-lg relative overflow-hidden"
        style={{ 
          border: '1px solid var(--brand-primary-tint-3)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(217, 247, 230, 0.1) 100%)'
        }}
      >
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
          style={{ 
            background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
            transform: 'translate(40%, -40%)'
          }}
        />
        
        <CardHeader className="text-center pb-6 relative z-10">
          <CardTitle className="text-2xl" style={{ color: 'var(--brand-tertiary)' }}>
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription style={{ color: 'var(--brand-tertiary-tint-2)' }}>
            {mode === 'signup' 
              ? 'Join us to get personalized vehicle assistance'
              : 'Sign in to access your account'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Third-party authentication */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 shadow-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                borderColor: 'var(--brand-tertiary-tint-3)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
              }}
              onClick={() => handleThirdPartyAuth('google')}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-3" style={{ color: 'var(--brand-tertiary-tint-1)' }} />
              <span style={{ color: 'var(--brand-tertiary)' }}>Continue with Google</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 shadow-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                borderColor: 'var(--brand-tertiary-tint-3)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
              }}
              onClick={() => handleThirdPartyAuth('apple')}
              disabled={isLoading}
            >
              <Apple className="w-5 h-5 mr-3" style={{ color: 'var(--brand-tertiary-tint-1)' }} />
              <span style={{ color: 'var(--brand-tertiary)' }}>Continue with Apple</span>
            </Button>
          </div>

          <div className="relative">
            <Separator style={{ backgroundColor: 'var(--brand-tertiary-tint-3)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span 
                className="px-4 text-sm"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(217, 247, 230, 0.1) 100%)',
                  color: 'var(--brand-tertiary-tint-2)'
                }}
              >
                or
              </span>
            </div>
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" style={{ color: 'var(--brand-tertiary)' }}>
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    className={`transition-all duration-200 ${errors.firstName ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" style={{ color: 'var(--brand-tertiary)' }}>
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    className={`transition-all duration-200 ${errors.lastName ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: 'var(--brand-tertiary)' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`transition-all duration-200 ${errors.email ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: 'var(--brand-tertiary)' }}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`transition-all duration-200 ${errors.password ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" style={{ color: 'var(--brand-tertiary-tint-2)' }} />
                  ) : (
                    <Eye className="h-4 w-4" style={{ color: 'var(--brand-tertiary-tint-2)' }} />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: 'var(--brand-tertiary)' }}>
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    className={`transition-all duration-200 ${errors.confirmPassword ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" style={{ color: 'var(--brand-tertiary-tint-2)' }} />
                    ) : (
                      <Eye className="h-4 w-4" style={{ color: 'var(--brand-tertiary-tint-2)' }} />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 shadow-md border-0 brand-gradient-primary hover:opacity-90 transition-all duration-200"
              style={{ color: 'white' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Mode toggle */}
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto transition-colors hover:opacity-80"
              style={{ color: 'var(--brand-primary)' }}
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setFormData({
                  email: '',
                  password: '',
                  firstName: '',
                  lastName: '',
                  confirmPassword: '',
                });
                setErrors({});
              }}
              disabled={isLoading}
            >
              {mode === 'signup' 
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
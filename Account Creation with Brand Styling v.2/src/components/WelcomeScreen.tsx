'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Car, MessageSquare, Shield } from 'lucide-react';
import { User } from '../types/user';

interface WelcomeScreenProps {
  user: User;
  onGetStarted: () => void;
}

export function WelcomeScreen({ user, onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: Car,
      title: 'Vehicle Management',
      description: 'Add and manage your vehicle information for personalized assistance'
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Help',
      description: 'Get instant answers to your vehicle questions using our uMELI AI'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-level security'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card 
        className="shadow-lg relative overflow-hidden"
        style={{ 
          border: '1px solid var(--brand-primary-tint-3)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(217, 247, 230, 0.1) 100%)'
        }}
      >
        <div 
          className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-5"
          style={{ 
            background: 'radial-gradient(circle, var(--brand-secondary) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        <CardHeader className="text-center pb-6 relative z-10">
          <div className="flex justify-center mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-md relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary-tint-3) 100%)'
              }}
            >
              <CheckCircle 
                className="w-8 h-8 relative z-10" 
                style={{ color: 'var(--brand-primary)' }}
              />
              <div 
                className="absolute inset-0 rounded-full opacity-20"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
                }}
              />
            </div>
          </div>
          
          <CardTitle className="text-2xl" style={{ color: 'var(--brand-tertiary)' }}>
            Welcome{user.firstName ? `, ${user.firstName}` : ''}!
          </CardTitle>
          <CardDescription style={{ color: 'var(--brand-tertiary-tint-2)' }}>
            Your account has been successfully created. Let's get you started with our platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 relative z-10">
          {/* Features overview */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-center" style={{ color: 'var(--brand-tertiary)' }}>
              What you can do:
            </h3>
            
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 p-4 rounded-lg shadow-sm relative overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--brand-primary-tint-3) 0%, var(--brand-secondary) 100%)',
                    border: '1px solid var(--brand-primary-tint-2)'
                  }}
                >
                  <div 
                    className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-10"
                    style={{ 
                      background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                      transform: 'translate(25%, -25%)'
                    }}
                  />
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm relative z-10"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-1 relative z-10">
                    <h4 className="font-medium" style={{ color: 'var(--brand-tertiary)' }}>
                      {feature.title}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account details */}
          <div 
            className="p-4 rounded-lg shadow-sm relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(35, 53, 67, 0.05) 0%, rgba(73, 91, 105, 0.08) 100%)',
              border: '1px solid var(--brand-tertiary-tint-3)'
            }}
          >
            <div 
              className="absolute bottom-0 right-0 w-16 h-16 rounded-full opacity-10"
              style={{ 
                background: 'radial-gradient(circle, var(--brand-tertiary) 0%, transparent 70%)',
                transform: 'translate(25%, 25%)'
              }}
            />
            <h4 className="font-medium mb-2" style={{ color: 'var(--brand-tertiary)' }}>
              Account Information
            </h4>
            <div className="space-y-1 text-sm relative z-10">
              <p>
                <span className="font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>Email:</span>{' '}
                <span style={{ color: 'var(--brand-tertiary-tint-2)' }}>{user.email}</span>
              </p>
              {user.firstName && user.lastName && (
                <p>
                  <span className="font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>Name:</span>{' '}
                  <span style={{ color: 'var(--brand-tertiary-tint-2)' }}>{user.firstName} {user.lastName}</span>
                </p>
              )}
              <p>
                <span className="font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>Member since:</span>{' '}
                <span style={{ color: 'var(--brand-tertiary-tint-2)' }}>{user.createdAt.toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={onGetStarted}
              className="w-full h-12 shadow-md border-0 brand-gradient-primary hover:opacity-90 transition-all duration-200"
              style={{ color: 'white' }}
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
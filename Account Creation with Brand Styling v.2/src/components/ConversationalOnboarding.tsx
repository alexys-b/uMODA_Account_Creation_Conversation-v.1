'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Eye, EyeOff, Chrome, Apple, Send, Bot, User as UserIcon } from 'lucide-react';
import { User, ThirdPartyProvider } from '../types/user';

interface ConversationalOnboardingProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

type ConversationStep = 
  | 'greeting'
  | 'name-request'
  | 'name-input'
  | 'email-request' 
  | 'email-input'
  | 'password-request'
  | 'password-input'
  | 'confirmation'
  | 'creating-account'
  | 'third-party-options';

interface Message {
  id: string;
  sender: 'umeli' | 'user';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

export function ConversationalOnboarding({ onSuccess, onError }: ConversationalOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start the conversation
    setTimeout(() => {
      addUmeliMessage("Hello there! 👋 I'm uMELI, your personal vehicle AI assistant. I'm excited to meet you!");
    }, 1000);
    
    setTimeout(() => {
      addUmeliMessage("I'm here to help you with everything related to your vehicle - from maintenance reminders to troubleshooting questions. But first, let's get you set up with an account!");
    }, 3000);
    
    setTimeout(() => {
      setCurrentStep('name-request');
      addUmeliMessage("What should I call you? Could you share your first and last name?");
    }, 5500);
  }, []);

  const addUmeliMessage = (content: string) => {
    setIsTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.max(1000, content.length * 30);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'umeli',
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && currentStep !== 'third-party-options') return;

    switch (currentStep) {
      case 'name-input':
        handleNameInput();
        break;
      case 'email-input':
        handleEmailInput();
        break;
      case 'password-input':
        handlePasswordInput();
        break;
    }
  };

  const handleNameInput = () => {
    const names = userInput.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');
    
    if (!firstName) {
      addUmeliMessage("I didn't catch that. Could you please share your name?");
      return;
    }

    addUserMessage(userInput);
    setUserData(prev => ({ ...prev, firstName, lastName }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`Nice to meet you, ${firstName}! ${lastName ? `${firstName} ${lastName} - I'll remember that.` : `Just ${firstName} works perfectly!`}`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('email-request');
      addUmeliMessage("Now, I'll need your email address to create your account. What email would you like to use?");
    }, 2000);
  };

  const handleEmailInput = () => {
    const email = userInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      addUmeliMessage("Hmm, that doesn't look like a valid email address. Could you double-check and try again?");
      return;
    }

    addUserMessage(email);
    setUserData(prev => ({ ...prev, email }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`Perfect! I've got your email as ${email}. `);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('password-request');
      addUmeliMessage("Last step - I need you to create a secure password. Make sure it's at least 8 characters long to keep your account safe! 🔒");
    }, 2000);
  };

  const handlePasswordInput = () => {
    const password = userInput;
    
    if (password.length < 8) {
      addUmeliMessage("That password is a bit too short. Let's make sure it's at least 8 characters for better security!");
      return;
    }

    addUserMessage('••••••••••••');
    setUserData(prev => ({ ...prev, password }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`Excellent! Your password is secure. Let me just review what we have:`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('confirmation');
      addUmeliMessage(`✓ Name: ${userData.firstName} ${userData.lastName || ''}\n✓ Email: ${userData.email}\n✓ Password: Set securely\n\nEverything look good? I'll create your account now!`);
    }, 2000);
  };

  const handleCreateAccount = async () => {
    setCurrentStep('creating-account');
    addUmeliMessage("Creating your account now... This will just take a moment! ⚡");
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const user: User = {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTimeout(() => {
        addUmeliMessage(`🎉 Welcome to uMODA, ${userData.firstName}! Your account has been created successfully. I'm so excited to start helping you with your vehicle needs!`);
      }, 1000);

      setTimeout(() => {
        onSuccess?.(user);
      }, 3000);
      
    } catch (error) {
      addUmeliMessage("Oops! Something went wrong while creating your account. Let's try that again.");
      onError?.('Account creation failed. Please try again.');
      setCurrentStep('confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThirdPartyAuth = async (provider: ThirdPartyProvider) => {
    addUmeliMessage(`Great choice! Let me connect you with ${provider === 'google' ? 'Google' : 'Apple'} to get you signed up quickly...`);
    setIsLoading(true);
    
    try {
      // Simulate third-party auth
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const user: User = {
        id: '1',
        email: `user@${provider}.com`,
        firstName: 'User',
        lastName: 'Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTimeout(() => {
        addUmeliMessage(`Perfect! You're all signed up through ${provider === 'google' ? 'Google' : 'Apple'}. Welcome to uMODA! 🎉`);
      }, 500);

      setTimeout(() => {
        onSuccess?.(user);
      }, 2500);
      
    } catch (error) {
      addUmeliMessage(`Hmm, there was an issue with ${provider === 'google' ? 'Google' : 'Apple'} sign-up. Would you like to try the manual setup instead?`);
      onError?.(`${provider} authentication failed. Please try again.`);
      setCurrentStep('name-request');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = () => {
    if (currentStep === 'confirmation') {
      return (
        <div className="flex gap-2">
          <Button
            onClick={handleCreateAccount}
            className="flex-1 h-12 brand-gradient-primary hover:opacity-90 transition-all duration-200"
            style={{ color: 'white' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create My Account'}
          </Button>
        </div>
      );
    }

    if (currentStep === 'creating-account') {
      return null;
    }

    if (!['name-input', 'email-input', 'password-input'].includes(currentStep)) {
      return null;
    }

    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            key={currentStep} // Force re-render when step changes
            type={currentStep === 'password-input' ? (showPassword ? 'text' : 'password') : 'text'}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              currentStep === 'name-input' ? 'Enter your name...' :
              currentStep === 'email-input' ? 'Enter your email...' :
              'Enter your password...'
            }
            className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200"
            disabled={isLoading}
            autoFocus={shouldFocusInput}
          />
          {currentStep === 'password-input' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" style={{ color: 'var(--brand-tertiary-tint-2)' }} />
              ) : (
                <Eye className="h-4 w-4" style={{ color: 'var(--brand-tertiary-tint-2)' }} />
              )}
            </Button>
          )}
        </div>
        <Button
          type="submit"
          className="h-12 px-4 brand-gradient-primary hover:opacity-90 transition-all duration-200"
          style={{ color: 'white' }}
          disabled={isLoading || !userInput.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    );
  };

  // Set input focus and step
  useEffect(() => {
    if (currentStep === 'name-request') {
      setTimeout(() => {
        setCurrentStep('name-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'email-request') {
      setTimeout(() => {
        setCurrentStep('email-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'password-request') {
      setTimeout(() => {
        setCurrentStep('password-input');
        setShouldFocusInput(true);
      }, 500);
    }
  }, [currentStep]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card 
        className="shadow-lg relative overflow-hidden"
        style={{ 
          border: '1px solid var(--brand-primary-tint-3)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(217, 247, 230, 0.1) 100%)',
          minHeight: '500px',
          maxHeight: '600px'
        }}
      >
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
          style={{ 
            background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
            transform: 'translate(40%, -40%)'
          }}
        />
        
        <CardContent className="p-6 flex flex-col h-full relative z-10">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4" style={{ maxHeight: '400px' }}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    {message.sender === 'umeli' && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div 
                      className={`p-3 rounded-lg shadow-sm ${
                        message.sender === 'user' 
                          ? 'bg-brand-primary text-white' 
                          : 'bg-white dark:bg-[#233543]'
                      }`}
                      style={{
                        border: message.sender === 'user' 
                          ? 'none' 
                          : '1px solid var(--brand-tertiary-tint-3)',
                        background: message.sender === 'user' 
                          ? 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-tint-1) 100%)' 
                          : undefined
                      }}
                    >
                      <p 
                        className={`text-sm whitespace-pre-line ${
                          message.sender === 'user' 
                            ? 'text-white' 
                            : 'text-brand-tertiary dark:text-white'
                        }`}
                      >
                        {message.content}
                      </p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: 'var(--brand-tertiary-tint-2)' }}
                      >
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div 
                    className="p-3 rounded-lg shadow-sm bg-white dark:bg-[#233543]"
                    style={{ border: '1px solid var(--brand-tertiary-tint-3)' }}
                  >
                    <div className="flex space-x-1">
                      <div 
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'var(--brand-primary)',
                          animationDelay: '0ms'
                        }}
                      />
                      <div 
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'var(--brand-primary)',
                          animationDelay: '150ms'
                        }}
                      />
                      <div 
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: 'var(--brand-primary)',
                          animationDelay: '300ms'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Third-party options at the beginning */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 6.5 }}
              className="space-y-3 mb-4"
            >
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
                    or sign up quickly with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 shadow-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{ 
                    borderColor: 'var(--brand-tertiary-tint-3)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
                  }}
                  onClick={() => handleThirdPartyAuth('google')}
                  disabled={isLoading}
                >
                  <Chrome className="w-5 h-5 mr-2" style={{ color: 'var(--brand-tertiary-tint-1)' }} />
                  <span style={{ color: 'var(--brand-tertiary)' }}>Google</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 shadow-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{ 
                    borderColor: 'var(--brand-tertiary-tint-3)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
                  }}
                  onClick={() => handleThirdPartyAuth('apple')}
                  disabled={isLoading}
                >
                  <Apple className="w-5 h-5 mr-2" style={{ color: 'var(--brand-tertiary-tint-1)' }} />
                  <span style={{ color: 'var(--brand-tertiary)' }}>Apple</span>
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Input Area */}
          {renderInput()}
        </CardContent>
      </Card>
    </div>
  );
}
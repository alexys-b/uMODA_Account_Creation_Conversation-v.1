'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Send, Bot, User as UserIcon, Brain, SkipForward, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { 
  User, 
  AIPreferences,
  COMMUNICATION_STYLES,
  RESPONSE_LENGTHS,
  PERSONALITY_TRAITS,
  FOCUS_AREAS
} from '../types/user';

interface ConversationalAIPersonalizationProps {
  user: User;
  onComplete?: (preferences: AIPreferences) => void;
  onSkip?: () => void;
}

type ConversationStep = 
  | 'greeting'
  | 'name-request'
  | 'name-input'
  | 'style-request'
  | 'style-selection'
  | 'detail-request'
  | 'detail-selection'
  | 'personality-request'
  | 'personality-selection'
  | 'focus-request'
  | 'focus-selection'
  | 'notifications-request'
  | 'notifications-selection'
  | 'confirmation'
  | 'saving';

interface Message {
  id: string;
  sender: 'umeli' | 'user';
  content: string;
  timestamp: Date;
}

export function ConversationalAIPersonalization({ user, onComplete, onSkip }: ConversationalAIPersonalizationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [preferences, setPreferences] = useState({
    preferredName: user.firstName || '',
    communicationStyle: '',
    responseLength: '',
    personalityTraits: [] as string[],
    focusAreas: [] as string[],
    notifications: {
      maintenance: true,
      tips: true,
      recalls: true
    }
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
      addUmeliMessage(`Perfect, ${user.firstName}! Now let's personalize how I communicate with you. 🧠✨`);
    }, 1000);
    
    setTimeout(() => {
      addUmeliMessage("I want to make sure I'm helpful in exactly the way you prefer. Think of this as teaching me your communication style!");
    }, 3500);
    
    setTimeout(() => {
      setCurrentStep('name-request');
      addUmeliMessage(`What would you like me to call you? I can stick with ${user.firstName}, or if you prefer something else like a nickname, just let me know!`);
    }, 6000);
  }, [user.firstName]);

  const addUmeliMessage = (content: string) => {
    setIsTyping(true);
    
    const typingDelay = Math.max(1000, content.length * 25);
    
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
    if (!userInput.trim()) return;

    switch (currentStep) {
      case 'name-input':
        handleNameInput();
        break;
    }
  };

  const handleNameInput = () => {
    const name = userInput.trim();
    const keepCurrent = ['same', 'keep', user.firstName?.toLowerCase(), 'no change', 'that\'s fine'].some(word => 
      name.toLowerCase().includes(word)
    );
    
    addUserMessage(userInput);
    
    if (keepCurrent || !name) {
      setPreferences(prev => ({ ...prev, preferredName: user.firstName || '' }));
      setTimeout(() => {
        addUmeliMessage(`Got it! I'll keep calling you ${user.firstName}. 👍`);
      }, 500);
    } else {
      setPreferences(prev => ({ ...prev, preferredName: name }));
      setTimeout(() => {
        addUmeliMessage(`Perfect! I'll call you ${name} from now on. Nice to meet you properly! 😊`);
      }, 500);
    }
    
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      setCurrentStep('style-request');
      addUmeliMessage("Now, how would you like me to communicate with you? I can adapt my style to match what works best for you!");
    }, 2500);
  };

  const handleStyleSelection = (style: string) => {
    setPreferences(prev => ({ ...prev, communicationStyle: style }));
    const selectedStyle = COMMUNICATION_STYLES.find(s => s.value === style);
    
    addUserMessage(selectedStyle?.label || style);
    
    setTimeout(() => {
      addUmeliMessage(`Excellent choice! I'll be ${selectedStyle?.description.toLowerCase()}.`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('detail-request');
      addUmeliMessage("How detailed would you like my responses to be? Some people prefer quick answers, others like comprehensive explanations.");
    }, 2500);
  };

  const handleDetailSelection = (length: string) => {
    setPreferences(prev => ({ ...prev, responseLength: length }));
    const selectedLength = RESPONSE_LENGTHS.find(l => l.value === length);
    
    addUserMessage(selectedLength?.label || length);
    
    setTimeout(() => {
      addUmeliMessage(`Perfect! I'll provide ${selectedLength?.description.toLowerCase()}.`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('personality-request');
      addUmeliMessage("What personality traits would you like me to have? Pick any that appeal to you - I can be helpful and patient, or maybe more direct and analytical. Choose as many as you like!");
    }, 2500);
  };

  const handlePersonalityToggle = (trait: string) => {
    setPreferences(prev => ({
      ...prev,
      personalityTraits: prev.personalityTraits.includes(trait)
        ? prev.personalityTraits.filter(t => t !== trait)
        : [...prev.personalityTraits, trait]
    }));
  };

  const handlePersonalityConfirm = () => {
    const traits = preferences.personalityTraits;
    
    if (traits.length === 0) {
      addUmeliMessage("No specific traits? That's okay! I'll use my default balanced personality. 😊");
    } else {
      addUmeliMessage(`Awesome! I'll be ${traits.slice(0, 3).join(', ')}${traits.length > 3 ? ` and ${traits.length - 3} more traits` : ''}. I think we'll work great together!`);
    }
    
    setTimeout(() => {
      setCurrentStep('focus-request');
      addUmeliMessage("What areas should I focus on when helping you? This helps me prioritize the most relevant information for your needs.");
    }, 2500);
  };

  const handleFocusToggle = (area: string) => {
    setPreferences(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleFocusConfirm = () => {
    const areas = preferences.focusAreas;
    
    if (areas.length === 0) {
      addUmeliMessage("I'll help with everything equally! General vehicle assistance it is. 🚗");
    } else {
      addUmeliMessage(`Great choices! I'll focus on ${areas.slice(0, 2).join(' and ')}${areas.length > 2 ? ` plus ${areas.length - 2} other areas` : ''}. This will help me give you the most relevant advice!`);
    }
    
    setTimeout(() => {
      setCurrentStep('notifications-request');
      addUmeliMessage("Last thing - what kind of notifications would you like? I can remind you about maintenance, share helpful tips, and alert you to important safety information.");
    }, 2500);
  };

  const handleNotificationToggle = (type: 'maintenance' | 'tips' | 'recalls') => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleNotificationsConfirm = () => {
    const notifs = preferences.notifications;
    const enabledCount = Object.values(notifs).filter(Boolean).length;
    
    if (enabledCount === 0) {
      addUmeliMessage("No notifications - I'll only help when you ask! Sometimes less is more. 👌");
    } else if (enabledCount === 3) {
      addUmeliMessage("All notifications enabled! I'll keep you fully informed about your vehicle. 📱");
    } else {
      addUmeliMessage(`Perfect! I'll send you ${enabledCount} types of notifications to keep you updated without overwhelming you.`);
    }
    
    setTimeout(() => {
      setCurrentStep('confirmation');
      const name = preferences.preferredName;
      const style = COMMUNICATION_STYLES.find(s => s.value === preferences.communicationStyle)?.label;
      const detail = RESPONSE_LENGTHS.find(l => l.value === preferences.responseLength)?.label;
      
      addUmeliMessage(`Excellent! Here's how I'll be helping you:\n\n👤 I'll call you: ${name}\n💬 Communication: ${style}\n📝 Response detail: ${detail}\n✨ Personality: ${preferences.personalityTraits.length > 0 ? preferences.personalityTraits.slice(0, 3).join(', ') : 'Balanced'}\n🎯 Focus areas: ${preferences.focusAreas.length > 0 ? preferences.focusAreas.slice(0, 2).join(', ') : 'General assistance'}\n\nReady to save these preferences?`);
    }, 2500);
  };

  const handleSavePreferences = async () => {
    setCurrentStep('saving');
    addUmeliMessage("Saving your preferences... This is exciting! 🎉");
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiPreferences: AIPreferences = {
        communicationStyle: preferences.communicationStyle as any,
        responseLength: preferences.responseLength as any,
        personalityTraits: preferences.personalityTraits,
        focusAreas: preferences.focusAreas,
        notificationPreferences: preferences.notifications,
        preferredName: preferences.preferredName || undefined,
      };

      setTimeout(() => {
        addUmeliMessage(`🎊 Perfect! Your personalized uMELI experience is ready, ${preferences.preferredName}! I'm so excited to start helping you with your vehicle needs in exactly the way you prefer.`);
      }, 1000);

      setTimeout(() => {
        onComplete?.(aiPreferences);
      }, 3500);
      
    } catch (error) {
      addUmeliMessage("Oops! Something went wrong while saving your preferences. Let's try that again.");
      setCurrentStep('confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = () => {
    if (currentStep === 'name-input') {
      return (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              key={currentStep}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`e.g., ${user.firstName}, or a nickname...`}
              className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200"
              disabled={isLoading}
              autoFocus={shouldFocusInput}
            />
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
    }

    if (currentStep === 'style-selection') {
      return (
        <div className="space-y-3">
          {COMMUNICATION_STYLES.map((style) => (
            <Button
              key={style.value}
              variant="outline"
              className="w-full h-auto p-4 text-left justify-start shadow-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                borderColor: 'var(--brand-tertiary-tint-3)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
              }}
              onClick={() => handleStyleSelection(style.value)}
              disabled={isLoading}
            >
              <div className="space-y-1">
                <div className="font-medium" style={{ color: 'var(--brand-tertiary)' }}>
                  {style.label}
                </div>
                <div className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                  {style.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      );
    }

    if (currentStep === 'detail-selection') {
      return (
        <div className="space-y-3">
          {RESPONSE_LENGTHS.map((length) => (
            <Button
              key={length.value}
              variant="outline"
              className="w-full h-auto p-4 text-left justify-start shadow-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                borderColor: 'var(--brand-tertiary-tint-3)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
              }}
              onClick={() => handleDetailSelection(length.value)}
              disabled={isLoading}
            >
              <div className="space-y-1">
                <div className="font-medium" style={{ color: 'var(--brand-tertiary)' }}>
                  {length.label}
                </div>
                <div className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                  {length.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      );
    }

    if (currentStep === 'personality-selection') {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_TRAITS.map((trait) => (
              <Badge
                key={trait}
                variant="outline"
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  preferences.personalityTraits.includes(trait)
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-brand-tertiary-tint-3 hover:border-brand-primary'
                }`}
                onClick={() => handlePersonalityToggle(trait)}
              >
                {trait}
              </Badge>
            ))}
          </div>
          <Button
            onClick={handlePersonalityConfirm}
            className="w-full h-12 brand-gradient-primary hover:opacity-90 transition-all duration-200"
            style={{ color: 'white' }}
            disabled={isLoading}
          >
            Continue with Selected Traits
          </Button>
        </div>
      );
    }

    if (currentStep === 'focus-selection') {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FOCUS_AREAS.map((area) => (
              <Badge
                key={area}
                variant="outline"
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  preferences.focusAreas.includes(area)
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-brand-tertiary-tint-3 hover:border-brand-primary'
                }`}
                onClick={() => handleFocusToggle(area)}
              >
                {area}
              </Badge>
            ))}
          </div>
          <Button
            onClick={handleFocusConfirm}
            className="w-full h-12 brand-gradient-primary hover:opacity-90 transition-all duration-200"
            style={{ color: 'white' }}
            disabled={isLoading}
          >
            Continue with Selected Areas
          </Button>
        </div>
      );
    }

    if (currentStep === 'notifications-selection') {
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { key: 'maintenance' as const, label: 'Maintenance Reminders', desc: 'Get notified about upcoming maintenance' },
              { key: 'tips' as const, label: 'Tips & Recommendations', desc: 'Receive helpful tips and suggestions' },
              { key: 'recalls' as const, label: 'Safety Alerts & Recalls', desc: 'Important safety information and recalls' }
            ].map((item) => (
              <div
                key={item.key}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  preferences.notifications[item.key] 
                    ? 'border-brand-primary bg-brand-primary/10' 
                    : 'border-brand-tertiary-tint-3 bg-white/50'
                }`}
                onClick={() => handleNotificationToggle(item.key)}
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle 
                    className="w-5 h-5 mt-0.5"
                    style={{ 
                      color: preferences.notifications[item.key] 
                        ? 'var(--brand-primary)' 
                        : 'var(--brand-tertiary-tint-3)' 
                    }}
                  />
                  <div>
                    <div className="font-medium" style={{ color: 'var(--brand-tertiary)' }}>
                      {item.label}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={handleNotificationsConfirm}
            className="w-full h-12 brand-gradient-primary hover:opacity-90 transition-all duration-200"
            style={{ color: 'white' }}
            disabled={isLoading}
          >
            Save Notification Preferences
          </Button>
        </div>
      );
    }

    if (currentStep === 'confirmation') {
      return (
        <div className="flex gap-2">
          <Button
            onClick={handleSavePreferences}
            className="flex-1 h-12 brand-gradient-primary hover:opacity-90 transition-all duration-200"
            style={{ color: 'white' }}
            disabled={isLoading}
          >
            {isLoading ? 'Saving Preferences...' : 'Perfect! Save My Preferences'}
          </Button>
        </div>
      );
    }

    return null;
  };

  // Set input focus and step transitions
  useEffect(() => {
    if (currentStep === 'name-request') {
      setTimeout(() => {
        setCurrentStep('name-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'style-request') {
      setTimeout(() => {
        setCurrentStep('style-selection');
      }, 500);
    } else if (currentStep === 'detail-request') {
      setTimeout(() => {
        setCurrentStep('detail-selection');
      }, 500);
    } else if (currentStep === 'personality-request') {
      setTimeout(() => {
        setCurrentStep('personality-selection');
      }, 500);
    } else if (currentStep === 'focus-request') {
      setTimeout(() => {
        setCurrentStep('focus-selection');
      }, 500);
    } else if (currentStep === 'notifications-request') {
      setTimeout(() => {
        setCurrentStep('notifications-selection');
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
          <div className="flex-1 overflow-y-auto space-y-4 mb-4" style={{ maxHeight: '350px' }}>
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
                        <Brain className="w-4 h-4 text-white" />
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
                    <Brain className="w-4 h-4 text-white" />
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
          
          {/* Skip option at the beginning */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 7 }}
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
                    or use default settings
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 shadow-sm transition-all duration-200 hover:scale-[1.02]"
                style={{ 
                  borderColor: 'var(--brand-tertiary-tint-3)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
                }}
                onClick={onSkip}
                disabled={isLoading}
              >
                <SkipForward className="w-5 h-5 mr-2" style={{ color: 'var(--brand-tertiary-tint-1)' }} />
                <span style={{ color: 'var(--brand-tertiary)' }}>Use Default Settings</span>
              </Button>
            </motion.div>
          )}
          
          {/* Input Area */}
          {renderInput()}
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Send, Bot, User as UserIcon, Car, SkipForward } from 'lucide-react';
import { User, Vehicle, CAR_MAKES, VEHICLE_YEARS, VEHICLE_COLORS } from '../types/user';

interface ConversationalVehicleSetupProps {
  user: User;
  onComplete?: (vehicle: Vehicle) => void;
  onSkip?: () => void;
}

type ConversationStep = 
  | 'greeting'
  | 'make-request'
  | 'make-input'
  | 'model-request'
  | 'model-input'
  | 'year-request'
  | 'year-input'
  | 'color-request'
  | 'color-input'
  | 'nickname-request'
  | 'nickname-input'
  | 'mileage-request'
  | 'mileage-input'
  | 'confirmation'
  | 'saving';

interface Message {
  id: string;
  sender: 'umeli' | 'user';
  content: string;
  timestamp: Date;
}

export function ConversationalVehicleSetup({ user, onComplete, onSkip }: ConversationalVehicleSetupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    nickname: '',
    mileage: ''
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
      addUmeliMessage(`Great to have you here, ${user.firstName}! 🚗`);
    }, 1000);
    
    setTimeout(() => {
      addUmeliMessage("I'd love to learn about your vehicle so I can provide you with personalized maintenance reminders, troubleshooting help, and recommendations specific to your car.");
    }, 3000);
    
    setTimeout(() => {
      setCurrentStep('make-request');
      addUmeliMessage("Let's start with the basics - what make is your vehicle? (like Toyota, Honda, Ford, etc.)");
    }, 5500);
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
      case 'make-input':
        handleMakeInput();
        break;
      case 'model-input':
        handleModelInput();
        break;
      case 'year-input':
        handleYearInput();
        break;
      case 'color-input':
        handleColorInput();
        break;
      case 'nickname-input':
        handleNicknameInput();
        break;
      case 'mileage-input':
        handleMileageInput();
        break;
    }
  };

  const handleMakeInput = () => {
    const make = userInput.trim();
    const foundMake = CAR_MAKES.find(m => 
      m.name.toLowerCase().includes(make.toLowerCase()) || 
      make.toLowerCase().includes(m.name.toLowerCase())
    );
    
    const finalMake = foundMake ? foundMake.name : make;
    
    addUserMessage(userInput);
    setVehicleData(prev => ({ ...prev, make: finalMake }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`${finalMake} - excellent choice! 👍`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('model-request');
      if (foundMake) {
        addUmeliMessage(`What model ${finalMake} do you have? Some popular ones are: ${foundMake.models.slice(0, 4).join(', ')}...`);
      } else {
        addUmeliMessage(`What model ${finalMake} do you have?`);
      }
    }, 2000);
  };

  const handleModelInput = () => {
    const model = userInput.trim();
    
    addUserMessage(userInput);
    setVehicleData(prev => ({ ...prev, model }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`Nice! A ${vehicleData.make} ${model}. Now, what year is it?`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('year-request');
      addUmeliMessage("You can just type the year, like 2020 or 2018.");
    }, 2000);
  };

  const handleYearInput = () => {
    const yearInput = userInput.trim();
    const year = parseInt(yearInput);
    
    if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
      addUmeliMessage("Hmm, that doesn't look like a valid year. Could you double-check? For example: 2020");
      return;
    }
    
    addUserMessage(yearInput);
    setVehicleData(prev => ({ ...prev, year: yearInput }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`Perfect! A ${year} ${vehicleData.make} ${vehicleData.model}.`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('color-request');
      addUmeliMessage("What color is your vehicle? This helps me identify it better in my recommendations!");
    }, 2000);
  };

  const handleColorInput = () => {
    const color = userInput.trim();
    
    addUserMessage(userInput);
    setVehicleData(prev => ({ ...prev, color }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`${color} - that sounds great! 🎨`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('nickname-request');
      addUmeliMessage("Do you have a nickname for your car? Some people call theirs 'Betsy' or 'Lightning' - it's totally optional but adds a personal touch! If not, just type 'none' or 'skip'.");
    }, 2500);
  };

  const handleNicknameInput = () => {
    const nickname = userInput.trim();
    const skipWords = ['none', 'skip', 'no', 'nothing', 'nope'];
    
    addUserMessage(userInput);
    
    if (skipWords.some(word => nickname.toLowerCase().includes(word))) {
      setVehicleData(prev => ({ ...prev, nickname: '' }));
      setTimeout(() => {
        addUmeliMessage("No problem! We'll keep it formal. 😊");
      }, 500);
    } else {
      setVehicleData(prev => ({ ...prev, nickname }));
      setTimeout(() => {
        addUmeliMessage(`${nickname} - I love it! That's such a great name. 💚`);
      }, 500);
    }
    
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      setCurrentStep('mileage-request');
      addUmeliMessage("Last question - what's the current mileage? This helps me give you accurate maintenance reminders. Just the number is fine, like 45000.");
    }, 2500);
  };

  const handleMileageInput = () => {
    const mileageInput = userInput.trim().replace(/[^\d]/g, ''); // Remove non-digits
    const mileage = parseInt(mileageInput);
    
    if (!mileage || mileage < 0 || mileage > 999999) {
      addUmeliMessage("Could you double-check that mileage? Just enter the number like 50000 or 125000.");
      return;
    }
    
    addUserMessage(userInput);
    setVehicleData(prev => ({ ...prev, mileage: mileageInput }));
    setUserInput('');
    setShouldFocusInput(false);
    
    setTimeout(() => {
      addUmeliMessage(`Got it! ${mileage.toLocaleString()} miles.`);
    }, 500);
    
    setTimeout(() => {
      setCurrentStep('confirmation');
      const nickname = vehicleData.nickname;
      addUmeliMessage(`Perfect! Let me confirm what we have:\n\n🚗 Vehicle: ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}\n🎨 Color: ${vehicleData.color}${nickname ? `\n💫 Nickname: ${nickname}` : ''}\n📊 Mileage: ${mileage.toLocaleString()} miles\n\nLooks good? I'll add ${nickname || 'your vehicle'} to your profile!`);
    }, 2000);
  };

  const handleSaveVehicle = async () => {
    setCurrentStep('saving');
    addUmeliMessage("Adding your vehicle to your profile... 🔧");
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const vehicle: Vehicle = {
        id: '1',
        userId: user.id,
        make: vehicleData.make,
        model: vehicleData.model,
        year: parseInt(vehicleData.year),
        color: vehicleData.color || undefined,
        nickname: vehicleData.nickname || undefined,
        mileage: parseInt(vehicleData.mileage) || undefined,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTimeout(() => {
        const nickname = vehicleData.nickname;
        addUmeliMessage(`🎉 Awesome! ${nickname || `Your ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`} has been added to your profile. Now I can provide you with personalized maintenance schedules, recalls, and troubleshooting help!`);
      }, 1000);

      setTimeout(() => {
        onComplete?.(vehicle);
      }, 3500);
      
    } catch (error) {
      addUmeliMessage("Oops! Something went wrong while saving your vehicle. Let's try that again.");
      setCurrentStep('confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = () => {
    if (currentStep === 'confirmation') {
      return (
        <div className="flex gap-2">
          <Button
            onClick={handleSaveVehicle}
            className="flex-1 h-12 brand-gradient-primary hover:opacity-90 transition-all duration-200"
            style={{ color: 'white' }}
            disabled={isLoading}
          >
            {isLoading ? 'Saving Vehicle...' : 'Add to Profile'}
          </Button>
        </div>
      );
    }

    if (currentStep === 'saving') {
      return null;
    }

    if (!['make-input', 'model-input', 'year-input', 'color-input', 'nickname-input', 'mileage-input'].includes(currentStep)) {
      return null;
    }

    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            key={currentStep}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              currentStep === 'make-input' ? 'e.g., Toyota, Honda, Ford...' :
              currentStep === 'model-input' ? 'e.g., Camry, Civic, F-150...' :
              currentStep === 'year-input' ? 'e.g., 2020, 2018...' :
              currentStep === 'color-input' ? 'e.g., White, Black, Blue...' :
              currentStep === 'nickname-input' ? 'e.g., Lightning, Betsy, or skip...' :
              'e.g., 45000, 120000...'
            }
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
  };

  // Set input focus and step
  useEffect(() => {
    if (currentStep === 'make-request') {
      setTimeout(() => {
        setCurrentStep('make-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'model-request') {
      setTimeout(() => {
        setCurrentStep('model-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'year-request') {
      setTimeout(() => {
        setCurrentStep('year-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'color-request') {
      setTimeout(() => {
        setCurrentStep('color-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'nickname-request') {
      setTimeout(() => {
        setCurrentStep('nickname-input');
        setShouldFocusInput(true);
      }, 500);
    } else if (currentStep === 'mileage-request') {
      setTimeout(() => {
        setCurrentStep('mileage-input');
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
                        <Car className="w-4 h-4 text-white" />
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
                    <Car className="w-4 h-4 text-white" />
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
                    or add your vehicle later
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
                <span style={{ color: 'var(--brand-tertiary)' }}>Skip for Now</span>
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
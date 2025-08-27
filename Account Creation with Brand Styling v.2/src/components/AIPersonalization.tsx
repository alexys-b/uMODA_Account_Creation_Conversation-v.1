'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Brain, Sparkles, ArrowRight, Settings } from 'lucide-react';
import { 
  AIPreferences, 
  AIPreferencesFormData, 
  User, 
  COMMUNICATION_STYLES, 
  RESPONSE_LENGTHS, 
  PERSONALITY_TRAITS, 
  FOCUS_AREAS 
} from '../types/user';

interface AIPersonalizationProps {
  user: User;
  onComplete: (preferences: AIPreferences) => void;
  onSkip?: () => void;
}

export function AIPersonalization({ user, onComplete, onSkip }: AIPersonalizationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AIPreferencesFormData>({
    communicationStyle: '',
    responseLength: '',
    personalityTraits: [],
    focusAreas: [],
    maintenanceNotifications: true,
    tipsNotifications: true,
    recallsNotifications: true,
    preferredName: user.firstName || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const preferences: AIPreferences = {
        communicationStyle: formData.communicationStyle as any,
        responseLength: formData.responseLength as any,
        personalityTraits: formData.personalityTraits,
        focusAreas: formData.focusAreas,
        notificationPreferences: {
          maintenance: formData.maintenanceNotifications,
          tips: formData.tipsNotifications,
          recalls: formData.recallsNotifications,
        },
        preferredName: formData.preferredName || undefined,
      };

      onComplete(preferences);
    } catch (error) {
      console.error('Error saving AI preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStyleSelection = (style: string) => {
    setFormData(prev => ({ ...prev, communicationStyle: style }));
  };

  const handleLengthSelection = (length: string) => {
    setFormData(prev => ({ ...prev, responseLength: length }));
  };

  const handleTraitToggle = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      personalityTraits: prev.personalityTraits.includes(trait)
        ? prev.personalityTraits.filter(t => t !== trait)
        : [...prev.personalityTraits, trait]
    }));
  };

  const handleFocusToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-md relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-tint-1) 100%)'
                }}
              >
                <Brain className="w-8 h-8 text-white relative z-10" />
                <div 
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
                  }}
                />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl" style={{ color: 'var(--brand-tertiary)' }}>
              Personalize your uMELI Experience
            </CardTitle>
            <CardDescription style={{ color: 'var(--brand-tertiary-tint-2)' }}>
              Customize how our AI assistant communicates with you to create the perfect 
              personalized experience for your vehicle needs.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Preferred Name */}
              <div 
                className="space-y-4 p-4 rounded-lg relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, var(--brand-secondary) 0%, rgba(217, 247, 230, 0.6) 100%)',
                  border: '1px solid var(--brand-primary-tint-3)'
                }}
              >
                <div 
                  className="absolute bottom-0 right-0 w-16 h-16 rounded-full opacity-10"
                  style={{ 
                    background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                    transform: 'translate(25%, 25%)'
                  }}
                />
                
                <h3 className="font-medium relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                  How should uMELI address you?
                </h3>
                
                <div className="relative z-10">
                  <Label htmlFor="preferredName" style={{ color: 'var(--brand-tertiary)' }}>
                    Preferred Name (Optional)
                  </Label>
                  <Input
                    id="preferredName"
                    type="text"
                    placeholder="e.g., John, Dr. Smith, or leave blank"
                    value={formData.preferredName}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
                    className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200 mt-2"
                    disabled={isLoading}
                  />
                  <p className="text-sm mt-1" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                    This is how uMELI will greet you in conversations
                  </p>
                </div>
              </div>

              {/* Communication Style */}
              <div 
                className="space-y-4 p-4 rounded-lg relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, var(--brand-primary-tint-3) 0%, rgba(255, 176, 137, 0.3) 100%)',
                  border: '1px solid var(--brand-primary-tint-2)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 w-16 h-16 rounded-full opacity-10"
                  style={{ 
                    background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                    transform: 'translate(-25%, -25%)'
                  }}
                />
                
                <h3 className="font-medium relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                  Communication Style
                </h3>
                
                <div className="grid gap-3 relative z-10">
                  {COMMUNICATION_STYLES.map((style) => (
                    <div
                      key={style.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        formData.communicationStyle === style.value 
                          ? 'border-brand-primary bg-white shadow-md' 
                          : 'border-brand-tertiary-tint-3 bg-white/50'
                      }`}
                      onClick={() => handleStyleSelection(style.value)}
                    >
                      <div className="flex items-start space-x-3">
                        <div 
                          className={`w-4 h-4 rounded-full border-2 mt-1 ${
                            formData.communicationStyle === style.value 
                              ? 'border-brand-primary bg-brand-primary' 
                              : 'border-brand-tertiary-tint-3'
                          }`}
                        />
                        <div>
                          <h4 className="font-medium" style={{ color: 'var(--brand-tertiary)' }}>
                            {style.label}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                            {style.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Length */}
              <div 
                className="space-y-4 p-4 rounded-lg relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(35, 53, 67, 0.08) 0%, rgba(73, 91, 105, 0.12) 100%)',
                  border: '1px solid var(--brand-tertiary-tint-3)'
                }}
              >
                <div 
                  className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-10"
                  style={{ 
                    background: 'radial-gradient(circle, var(--brand-tertiary) 0%, transparent 70%)',
                    transform: 'translate(-25%, 25%)'
                  }}
                />
                
                <h3 className="font-medium relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                  Response Detail Level
                </h3>
                
                <div className="grid gap-3 relative z-10">
                  {RESPONSE_LENGTHS.map((length) => (
                    <div
                      key={length.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        formData.responseLength === length.value 
                          ? 'border-brand-primary bg-white shadow-md' 
                          : 'border-brand-tertiary-tint-3 bg-white/50'
                      }`}
                      onClick={() => handleLengthSelection(length.value)}
                    >
                      <div className="flex items-start space-x-3">
                        <div 
                          className={`w-4 h-4 rounded-full border-2 mt-1 ${
                            formData.responseLength === length.value 
                              ? 'border-brand-primary bg-brand-primary' 
                              : 'border-brand-tertiary-tint-3'
                          }`}
                        />
                        <div>
                          <h4 className="font-medium" style={{ color: 'var(--brand-tertiary)' }}>
                            {length.label}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                            {length.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personality Traits */}
              <div 
                className="space-y-4 p-4 rounded-lg relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, var(--brand-secondary) 0%, rgba(217, 247, 230, 0.6) 100%)',
                  border: '1px solid var(--brand-primary-tint-3)'
                }}
              >
                <div 
                  className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10"
                  style={{ 
                    background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                    transform: 'translate(25%, -25%)'
                  }}
                />
                
                <h3 className="font-medium relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                  AI Personality Traits
                </h3>
                <p className="text-sm relative z-10" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                  Select traits you'd like uMELI to embody (choose as many as you like)
                </p>
                
                <div className="flex flex-wrap gap-2 relative z-10">
                  {PERSONALITY_TRAITS.map((trait) => (
                    <Badge
                      key={trait}
                      variant="outline"
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.personalityTraits.includes(trait)
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-brand-tertiary-tint-3 hover:border-brand-primary'
                      }`}
                      onClick={() => handleTraitToggle(trait)}
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div 
                className="space-y-4 p-4 rounded-lg relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, var(--brand-primary-tint-3) 0%, rgba(255, 176, 137, 0.3) 100%)',
                  border: '1px solid var(--brand-primary-tint-2)'
                }}
              >
                <div 
                  className="absolute bottom-0 right-0 w-16 h-16 rounded-full opacity-10"
                  style={{ 
                    background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                    transform: 'translate(25%, 25%)'
                  }}
                />
                
                <h3 className="font-medium relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                  Areas of Focus
                </h3>
                <p className="text-sm relative z-10" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                  What topics are most important to you?
                </p>
                
                <div className="flex flex-wrap gap-2 relative z-10">
                  {FOCUS_AREAS.map((area) => (
                    <Badge
                      key={area}
                      variant="outline"
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.focusAreas.includes(area)
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-brand-tertiary-tint-3 hover:border-brand-primary'
                      }`}
                      onClick={() => handleFocusToggle(area)}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div 
                className="space-y-4 p-4 rounded-lg relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(35, 53, 67, 0.08) 0%, rgba(73, 91, 105, 0.12) 100%)',
                  border: '1px solid var(--brand-tertiary-tint-3)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 w-16 h-16 rounded-full opacity-10"
                  style={{ 
                    background: 'radial-gradient(circle, var(--brand-tertiary) 0%, transparent 70%)',
                    transform: 'translate(-25%, -25%)'
                  }}
                />
                
                <h3 className="font-medium relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                  Notification Preferences
                </h3>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="maintenance"
                      checked={formData.maintenanceNotifications}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, maintenanceNotifications: !!checked }))
                      }
                    />
                    <div>
                      <Label htmlFor="maintenance" style={{ color: 'var(--brand-tertiary)' }}>
                        Maintenance Reminders
                      </Label>
                      <p className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                        Get notified about upcoming maintenance based on your vehicle
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="tips"
                      checked={formData.tipsNotifications}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, tipsNotifications: !!checked }))
                      }
                    />
                    <div>
                      <Label htmlFor="tips" style={{ color: 'var(--brand-tertiary)' }}>
                        Tips & Recommendations
                      </Label>
                      <p className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                        Receive helpful tips and personalized recommendations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="recalls"
                      checked={formData.recallsNotifications}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, recallsNotifications: !!checked }))
                      }
                    />
                    <div>
                      <Label htmlFor="recalls" style={{ color: 'var(--brand-tertiary)' }}>
                        Safety Alerts & Recalls
                      </Label>
                      <p className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                        Important safety information and recall notices
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 shadow-md border-0 brand-gradient-primary hover:opacity-90 transition-all duration-200"
                  style={{ color: 'white' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Personalizing uMELI...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Complete Setup</span>
                    </div>
                  )}
                </Button>

                {onSkip && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 shadow-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ 
                      borderColor: 'var(--brand-tertiary-tint-3)',
                      color: 'var(--brand-tertiary)',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(217, 247, 230, 0.2) 100%)'
                    }}
                    onClick={onSkip}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Use Defaults</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Button>
                )}
              </div>
            </form>

            {/* Help text */}
            <div 
              className="p-4 rounded-lg shadow-sm relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-secondary) 0%, rgba(217, 247, 230, 0.6) 100%)',
                border: '1px solid var(--brand-primary-tint-3)'
              }}
            >
              <div 
                className="absolute bottom-0 left-0 w-12 h-12 rounded-full opacity-15"
                style={{ 
                  background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                  transform: 'translate(-25%, 25%)'
                }}
              />
              <p className="text-sm relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                <span className="font-medium">Don't worry!</span> You can always adjust these preferences later 
                in your settings. uMELI learns and adapts to provide you with the best possible experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
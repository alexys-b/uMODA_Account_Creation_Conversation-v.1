'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { User, Edit3, Mail, Car, Brain, CheckCircle, Save, ArrowRight } from 'lucide-react';
import { 
  User as UserType, 
  Vehicle, 
  AIPreferences,
  COMMUNICATION_STYLES,
  RESPONSE_LENGTHS
} from '../types/user';

interface ProfileScreenProps {
  user: UserType;
  vehicle?: Vehicle | null;
  aiPreferences?: AIPreferences | null;
  onComplete: (updatedData: { user: UserType; vehicle?: Vehicle; aiPreferences?: AIPreferences }) => void;
  onSkip?: () => void;
}

export function ProfileScreen({ user, vehicle, aiPreferences, onComplete, onSkip }: ProfileScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedUser: UserType = {
        ...user,
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        email: editedUser.email,
        updatedAt: new Date()
      };

      onComplete({
        user: updatedUser,
        vehicle,
        aiPreferences
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original values if canceling
      setEditedUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email
      });
    }
    setIsEditing(!isEditing);
  };

  const getCommunicationStyleLabel = (style: string) => {
    const styleObj = COMMUNICATION_STYLES.find(s => s.value === style);
    return styleObj?.label || style;
  };

  const getResponseLengthLabel = (length: string) => {
    const lengthObj = RESPONSE_LENGTHS.find(l => l.value === length);
    return lengthObj?.label || length;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
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
                <User className="w-8 h-8 text-white relative z-10" />
                <div 
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
                  }}
                />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl" style={{ color: 'var(--brand-tertiary)' }}>
              Your Profile
            </CardTitle>
            <CardDescription style={{ color: 'var(--brand-tertiary-tint-2)' }}>
              Review and customize your information before we finalize your uMODA experience.
              You can always make changes later from your settings.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className="shadow-md relative overflow-hidden"
            style={{ 
              border: '1px solid var(--brand-primary-tint-3)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(217, 247, 230, 0.1) 100%)'
            }}
          >
            <div 
              className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-5"
              style={{ 
                background: 'radial-gradient(circle, var(--brand-secondary) 0%, transparent 70%)',
                transform: 'translate(-25%, 25%)'
              }}
            />
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg" style={{ color: 'var(--brand-tertiary)' }}>
                      Personal Information
                    </CardTitle>
                    <CardDescription style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                      Your basic account details
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditToggle}
                  className="transition-all duration-200"
                  style={{ 
                    borderColor: 'var(--brand-tertiary-tint-3)',
                    color: 'var(--brand-tertiary)'
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative z-10">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" style={{ color: 'var(--brand-tertiary)' }}>
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={editedUser.firstName}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, firstName: e.target.value }))}
                        className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" style={{ color: 'var(--brand-tertiary)' }}>
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={editedUser.lastName}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, lastName: e.target.value }))}
                        className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" style={{ color: 'var(--brand-tertiary)' }}>
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="shadow-sm brand-gradient-primary hover:opacity-90 transition-all duration-200"
                      style={{ color: 'white' }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                        Name
                      </p>
                      <p style={{ color: 'var(--brand-tertiary)' }}>
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                        Email
                      </p>
                      <p style={{ color: 'var(--brand-tertiary)' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Member Since
                    </p>
                    <p style={{ color: 'var(--brand-tertiary)' }}>
                      {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Information */}
        {vehicle && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="shadow-md relative overflow-hidden"
              style={{ 
                border: '1px solid var(--brand-primary-tint-2)',
                background: 'linear-gradient(135deg, var(--brand-primary-tint-3) 0%, rgba(255, 176, 137, 0.2) 100%)'
              }}
            >
              <div 
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                style={{ 
                  background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                  transform: 'translate(25%, -25%)'
                }}
              />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg" style={{ color: 'var(--brand-tertiary)' }}>
                      Vehicle Information
                    </CardTitle>
                    <CardDescription style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Your registered vehicle details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Vehicle
                    </p>
                    <p style={{ color: 'var(--brand-tertiary)' }}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                      {vehicle.trim && ` ${vehicle.trim}`}
                    </p>
                  </div>
                  {vehicle.color && (
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                        Color
                      </p>
                      <p style={{ color: 'var(--brand-tertiary)' }}>
                        {vehicle.color}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicle.nickname && (
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                        Nickname
                      </p>
                      <p style={{ color: 'var(--brand-tertiary)' }}>
                        {vehicle.nickname}
                      </p>
                    </div>
                  )}
                  {vehicle.mileage && (
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                        Mileage
                      </p>
                      <p style={{ color: 'var(--brand-tertiary)' }}>
                        {vehicle.mileage.toLocaleString()} miles
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* AI Preferences */}
        {aiPreferences && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card 
              className="shadow-md relative overflow-hidden"
              style={{ 
                border: '1px solid var(--brand-tertiary-tint-3)',
                background: 'linear-gradient(135deg, rgba(35, 53, 67, 0.05) 0%, rgba(73, 91, 105, 0.08) 100%)'
              }}
            >
              <div 
                className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10"
                style={{ 
                  background: 'radial-gradient(circle, var(--brand-tertiary) 0%, transparent 70%)',
                  transform: 'translate(-25%, 25%)'
                }}
              />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg" style={{ color: 'var(--brand-tertiary)' }}>
                      uMELI AI Preferences
                    </CardTitle>
                    <CardDescription style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                      How you've customized your AI assistant
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Communication Style
                    </p>
                    <p style={{ color: 'var(--brand-tertiary)' }}>
                      {getCommunicationStyleLabel(aiPreferences.communicationStyle)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Response Detail
                    </p>
                    <p style={{ color: 'var(--brand-tertiary)' }}>
                      {getResponseLengthLabel(aiPreferences.responseLength)}
                    </p>
                  </div>
                </div>
                
                {aiPreferences.preferredName && (
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Preferred Name
                    </p>
                    <p style={{ color: 'var(--brand-tertiary)' }}>
                      {aiPreferences.preferredName}
                    </p>
                  </div>
                )}

                {aiPreferences.personalityTraits.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Personality Traits
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiPreferences.personalityTraits.map((trait) => (
                        <Badge
                          key={trait}
                          variant="outline"
                          className="border-brand-primary bg-brand-primary text-white"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {aiPreferences.focusAreas.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                      Focus Areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiPreferences.focusAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="outline"
                          className="border-brand-tertiary-tint-3"
                          style={{ color: 'var(--brand-tertiary)' }}
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator style={{ backgroundColor: 'var(--brand-tertiary-tint-3)' }} />
                
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--brand-tertiary-tint-1)' }}>
                    Notification Preferences
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle 
                        className="w-4 h-4"
                        style={{ 
                          color: aiPreferences.notificationPreferences.maintenance 
                            ? 'var(--brand-primary)' 
                            : 'var(--brand-tertiary-tint-3)' 
                        }}
                      />
                      <span className="text-sm" style={{ color: 'var(--brand-tertiary)' }}>
                        Maintenance Reminders
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle 
                        className="w-4 h-4"
                        style={{ 
                          color: aiPreferences.notificationPreferences.tips 
                            ? 'var(--brand-primary)' 
                            : 'var(--brand-tertiary-tint-3)' 
                        }}
                      />
                      <span className="text-sm" style={{ color: 'var(--brand-tertiary)' }}>
                        Tips & Recommendations
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle 
                        className="w-4 h-4"
                        style={{ 
                          color: aiPreferences.notificationPreferences.recalls 
                            ? 'var(--brand-primary)' 
                            : 'var(--brand-tertiary-tint-3)' 
                        }}
                      />
                      <span className="text-sm" style={{ color: 'var(--brand-tertiary)' }}>
                        Safety Alerts & Recalls
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Summary & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card 
            className="shadow-md relative overflow-hidden"
            style={{ 
              border: '1px solid var(--brand-primary-tint-3)',
              background: 'linear-gradient(135deg, var(--brand-secondary) 0%, rgba(217, 247, 230, 0.6) 100%)'
            }}
          >
            <div 
              className="absolute top-0 left-0 w-16 h-16 rounded-full opacity-15"
              style={{ 
                background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                transform: 'translate(-25%, -25%)'
              }}
            />
            
            <CardContent className="p-6 relative z-10">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium" style={{ color: 'var(--brand-tertiary)' }}>
                    You're All Set!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--brand-tertiary-tint-2)' }}>
                    Your profile is complete and your uMELI AI assistant is personalized to your preferences. 
                    You can always update these settings later from your dashboard.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => onComplete({ user, vehicle, aiPreferences })}
                    className="flex-1 h-12 shadow-md border-0 brand-gradient-primary hover:opacity-90 transition-all duration-200"
                    style={{ color: 'white' }}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Continue to Dashboard</span>
                    </div>
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
                        <span>Skip Review</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
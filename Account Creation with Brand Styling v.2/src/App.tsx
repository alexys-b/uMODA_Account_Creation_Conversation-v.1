'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ConversationalOnboarding } from './components/ConversationalOnboarding';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ConversationalVehicleSetup } from './components/ConversationalVehicleSetup';
import { ConversationalAIPersonalization } from './components/ConversationalAIPersonalization';
import { ProfileScreen } from './components/ProfileScreen';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { User, Vehicle, AIPreferences } from './types/user';
import { toast } from 'sonner@2.0.3';
import { Button } from './components/ui/button';

type AppState = 'auth' | 'welcome' | 'vehicle-setup' | 'ai-personalization' | 'profile' | 'dashboard';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [aiPreferences, setAiPreferences] = useState<AIPreferences | null>(null);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setAppState('welcome');
    toast.success(`Welcome${userData.firstName ? `, ${userData.firstName}` : ''}! Your account has been created successfully.`);
  };

  const handleAuthError = (error: string) => {
    toast.error(error);
  };

  const handleGetStarted = () => {
    setAppState('vehicle-setup');
  };

  const handleVehicleComplete = (vehicleData: Vehicle) => {
    setVehicle(vehicleData);
    setAppState('ai-personalization');
    toast.success(`${vehicleData.nickname || `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`} has been added to your profile!`);
  };

  const handleVehicleSkip = () => {
    setAppState('ai-personalization');
    toast.info('You can add your vehicle information later from your profile.');
  };

  const handleAIPersonalizationComplete = (preferences: AIPreferences) => {
    setAiPreferences(preferences);
    setAppState('profile');
    toast.success('Your uMELI experience has been personalized!');
  };

  const handleAIPersonalizationSkip = () => {
    setAppState('profile');
    toast.info('Default AI settings applied. You can customize your experience later in settings.');
  };

  const handleProfileComplete = (updatedData: { user: User; vehicle?: Vehicle; aiPreferences?: AIPreferences }) => {
    setUser(updatedData.user);
    if (updatedData.vehicle) setVehicle(updatedData.vehicle);
    if (updatedData.aiPreferences) setAiPreferences(updatedData.aiPreferences);
    setAppState('dashboard');
    toast.success('Welcome to your personalized uMODA dashboard! Ready to help with all your vehicle needs.');
  };

  const handleProfileSkip = () => {
    setAppState('dashboard');
    toast.info('Profile review skipped. You can always update your information later.');
  };

  if (appState === 'welcome' && user) {
    return (
      <div className="min-h-screen brand-bg-mesh flex items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <WelcomeScreen 
          user={user} 
          onGetStarted={handleGetStarted}
        />
      </div>
    );
  }

  if (appState === 'vehicle-setup' && user) {
    return (
      <div className="min-h-screen brand-bg-pattern flex items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <ConversationalVehicleSetup
          user={user}
          onComplete={handleVehicleComplete}
          onSkip={handleVehicleSkip}
        />
      </div>
    );
  }

  if (appState === 'ai-personalization' && user) {
    return (
      <div className="min-h-screen brand-bg-mesh flex items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <ConversationalAIPersonalization
          user={user}
          onComplete={handleAIPersonalizationComplete}
          onSkip={handleAIPersonalizationSkip}
        />
      </div>
    );
  }

  if (appState === 'profile' && user) {
    return (
      <div className="min-h-screen brand-bg-pattern flex items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <ProfileScreen
          user={user}
          vehicle={vehicle}
          aiPreferences={aiPreferences}
          onComplete={handleProfileComplete}
          onSkip={handleProfileSkip}
        />
      </div>
    );
  }

  if (appState === 'dashboard') {
    return (
      <div className="min-h-screen brand-bg-mesh flex items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-2xl mx-auto text-center space-y-6">
          <motion.div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-tint-1) 50%, var(--brand-primary-tint-2) 100%)'
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              y: [0, -10, 0]
            }}
            transition={{ 
              scale: { duration: 0.6, ease: "easeOut" },
              rotate: { duration: 0.8, ease: "easeOut" },
              y: { 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1
              }
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 360,
              transition: { duration: 0.5 }
            }}
          >
            <motion.span 
              className="text-lg font-bold text-white relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              uMODA
            </motion.span>
            <div 
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
              }}
            />
          </motion.div>
          
          <div className="space-y-3">
            <motion.h1 
              className="text-2xl font-bold brand-color-shift"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {user?.firstName ? `Welcome, ${user.firstName}!` : 'Welcome to uMODA'}
            </motion.h1>
            <p className="text-muted-foreground">
              {aiPreferences ? 
                `Your personalized uMELI assistant is ready to help${aiPreferences.preferredName && aiPreferences.preferredName !== user?.firstName ? `, ${aiPreferences.preferredName}` : ''}!` :
                'Your vehicle AI assistant is ready to help.'
              }
            </p>
          </div>

          {/* Vehicle Info Card */}
          {vehicle && (
            <motion.div 
              className="p-6 rounded-lg text-left shadow-md relative overflow-hidden brand-card-secondary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div 
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                style={{ 
                  background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                  transform: 'translate(25%, -25%)'
                }}
              />
              <h3 className="font-medium mb-3 text-foreground">
                Your Vehicle
              </h3>
              <div className="space-y-2 text-sm relative z-10">
                <p>
                  <span className="font-medium text-muted-foreground">Vehicle:</span>{' '}
                  <span className="text-foreground">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                    {vehicle.trim && ` ${vehicle.trim}`}
                  </span>
                </p>
                {vehicle.color && (
                  <p>
                    <span className="font-medium text-muted-foreground">Color:</span>{' '}
                    <span className="text-foreground">{vehicle.color}</span>
                  </p>
                )}
                {vehicle.nickname && (
                  <p>
                    <span className="font-medium text-muted-foreground">Nickname:</span>{' '}
                    <span className="text-foreground">{vehicle.nickname}</span>
                  </p>
                )}
                {vehicle.mileage && (
                  <p>
                    <span className="font-medium text-muted-foreground">Mileage:</span>{' '}
                    <span className="text-foreground">{vehicle.mileage.toLocaleString()} miles</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* AI Preferences Card */}
          {aiPreferences && (
            <motion.div 
              className="p-6 rounded-lg text-left shadow-md relative overflow-hidden brand-card-primary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div 
                className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10"
                style={{ 
                  background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                  transform: 'translate(-25%, 25%)'
                }}
              />
              <h3 className="font-medium mb-3 text-foreground">
                uMELI AI Preferences
              </h3>
              <div className="space-y-2 text-sm relative z-10">
                <p>
                  <span className="font-medium text-muted-foreground">Style:</span>{' '}
                  <span className="text-foreground">
                    {aiPreferences.communicationStyle.charAt(0).toUpperCase() + aiPreferences.communicationStyle.slice(1)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">Response Detail:</span>{' '}
                  <span className="text-foreground">
                    {aiPreferences.responseLength.charAt(0).toUpperCase() + aiPreferences.responseLength.slice(1)}
                  </span>
                </p>
                {aiPreferences.personalityTraits.length > 0 && (
                  <p>
                    <span className="font-medium text-muted-foreground">Personality:</span>{' '}
                    <span className="text-foreground">
                      {aiPreferences.personalityTraits.slice(0, 3).join(', ')}
                      {aiPreferences.personalityTraits.length > 3 && ` +${aiPreferences.personalityTraits.length - 3} more`}
                    </span>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <motion.div 
            className="p-4 rounded-lg shadow-sm relative overflow-hidden brand-card-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div 
              className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-10"
              style={{ 
                background: 'radial-gradient(circle, var(--brand-primary-tint-1) 0%, transparent 70%)',
                transform: 'translate(-25%, 25%)'
              }}
            />
            <p className="text-sm font-medium mb-2 text-foreground">
              Dashboard coming soon! You'll be able to:
            </p>
            <ul className="text-sm text-left space-y-1 relative z-10">
              <li className="text-muted-foreground">
                • Ask {aiPreferences ? 'personalized' : 'AI'} questions about your {vehicle ? 'vehicle' : 'car'}
              </li>
              <li className="text-muted-foreground">
                • Get maintenance reminders and schedules
              </li>
              <li className="text-muted-foreground">
                • Track service history
              </li>
              <li className="text-muted-foreground">
                • Receive personalized recommendations
              </li>
              <li className="text-muted-foreground">
                • Edit your profile and preferences
              </li>
            </ul>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3">
            {!vehicle && (
              <Button
                onClick={() => setAppState('vehicle-setup')}
                className="flex-1 h-12 shadow-md border-0 brand-gradient-primary hover:opacity-90 transition-opacity text-white"
              >
                Add Vehicle
              </Button>
            )}
            
            {!aiPreferences && (
              <Button
                onClick={() => setAppState('ai-personalization')}
                className="flex-1 h-12 shadow-md border-0 brand-gradient-primary hover:opacity-90 transition-opacity text-white"
              >
                Personalize uMELI
              </Button>
            )}

            <Button
              onClick={() => setAppState('profile')}
              variant="outline"
              className="h-12 shadow-sm transition-all duration-200 hover:scale-[1.02] brand-button-outline"
            >
              Edit Profile
            </Button>
            
            <button
              onClick={() => {
                setAppState('auth');
                setUser(null);
                setVehicle(null);
                setAiPreferences(null);
              }}
              className="text-sm underline transition-colors hover:opacity-80"
              style={{ color: 'var(--brand-primary)' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-bg-pattern flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-tint-1) 50%, var(--brand-primary-tint-2) 100%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0]
            }}
            transition={{ 
              scale: { duration: 0.5, ease: "easeOut" },
              opacity: { duration: 0.5 },
              y: { 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1
              }
            }}
            whileHover={{ 
              scale: 1.15,
              boxShadow: "0 0 40px rgba(219, 109, 61, 0.6)",
              transition: { duration: 0.2 }
            }}
          >
            <motion.span 
              className="text-sm font-bold text-white relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              uMODA
            </motion.span>
            <div 
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
              }}
            />
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold brand-color-shift">
              Meet uMELI
            </h1>
            <p className="text-lg max-w-md mx-auto text-muted-foreground">
              Your personal vehicle AI assistant is ready to get to know you!
            </p>
          </motion.div>
        </div>

        {/* Conversational Onboarding */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <ConversationalOnboarding 
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center text-sm max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-muted-foreground">
            By creating an account, you agree to our terms of service and privacy policy. 
            This platform is designed for vehicle assistance and does not collect or store sensitive personal information.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
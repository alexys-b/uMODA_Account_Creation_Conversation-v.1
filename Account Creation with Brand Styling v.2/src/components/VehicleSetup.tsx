'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Car, Plus, ArrowRight } from 'lucide-react';
import { VehicleFormData, Vehicle, User, CAR_MAKES, VEHICLE_YEARS, VEHICLE_COLORS } from '../types/user';

interface VehicleSetupProps {
  user: User;
  onComplete: (vehicle: Vehicle) => void;
  onSkip?: () => void;
}

export function VehicleSetup({ user, onComplete, onSkip }: VehicleSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: '',
    vin: '',
    color: '',
    trim: '',
    engine: '',
    transmission: '',
    mileage: '',
    nickname: '',
  });
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  const selectedMake = CAR_MAKES.find(make => make.name === formData.make);
  const availableModels = selectedMake ? selectedMake.models : [];

  const validateForm = (): boolean => {
    const newErrors: Partial<VehicleFormData> = {};

    if (!formData.make) {
      newErrors.make = 'Vehicle make is required';
    }
    if (!formData.model) {
      newErrors.model = 'Vehicle model is required';
    }
    if (!formData.year) {
      newErrors.year = 'Vehicle year is required';
    }
    if (formData.vin && formData.vin.length !== 17) {
      newErrors.vin = 'VIN must be exactly 17 characters';
    }
    if (formData.mileage && (isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0)) {
      newErrors.mileage = 'Please enter a valid mileage';
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
      
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        userId: user.id,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        vin: formData.vin || undefined,
        color: formData.color || undefined,
        trim: formData.trim || undefined,
        engine: formData.engine || undefined,
        transmission: formData.transmission as any || undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        nickname: formData.nickname || undefined,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onComplete(vehicle);
    } catch (error) {
      console.error('Error creating vehicle profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof VehicleFormData) => (value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset model when make changes
      if (field === 'make') {
        newData.model = '';
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
            className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-5"
            style={{ 
              background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
              transform: 'translate(-40%, -40%)'
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
                <Car className="w-8 h-8 text-white relative z-10" />
                <div 
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
                  }}
                />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl" style={{ color: 'var(--brand-tertiary)' }}>
              Add Your Vehicle
            </CardTitle>
            <CardDescription style={{ color: 'var(--brand-tertiary-tint-2)' }}>
              Help us personalize your experience by adding your vehicle information.
              This allows our AI to provide more accurate assistance.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Essential Information */}
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
                  Essential Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="make" style={{ color: 'var(--brand-tertiary)' }}>
                      Make *
                    </Label>
                    <Select
                      value={formData.make}
                      onValueChange={handleInputChange('make')}
                    >
                      <SelectTrigger 
                        className={`transition-all duration-200 ${errors.make ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                      >
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAR_MAKES.map((make) => (
                          <SelectItem key={make.name} value={make.name}>
                            {make.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.make && (
                      <p className="text-sm text-destructive">{errors.make}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" style={{ color: 'var(--brand-tertiary)' }}>
                      Model *
                    </Label>
                    <Select
                      value={formData.model}
                      onValueChange={handleInputChange('model')}
                      disabled={!formData.make}
                    >
                      <SelectTrigger 
                        className={`transition-all duration-200 ${errors.model ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                      >
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.model && (
                      <p className="text-sm text-destructive">{errors.model}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="year" style={{ color: 'var(--brand-tertiary)' }}>
                      Year *
                    </Label>
                    <Select
                      value={formData.year}
                      onValueChange={handleInputChange('year')}
                    >
                      <SelectTrigger 
                        className={`transition-all duration-200 ${errors.year ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                      >
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_YEARS.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.year && (
                      <p className="text-sm text-destructive">{errors.year}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color" style={{ color: 'var(--brand-tertiary)' }}>
                      Color
                    </Label>
                    <Select
                      value={formData.color}
                      onValueChange={handleInputChange('color')}
                    >
                      <SelectTrigger className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_COLORS.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
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
                  Additional Details (Optional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="vin" style={{ color: 'var(--brand-tertiary)' }}>
                      VIN Number
                    </Label>
                    <Input
                      id="vin"
                      type="text"
                      placeholder="17-character VIN"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin')(e.target.value.toUpperCase())}
                      className={`transition-all duration-200 ${errors.vin ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                      maxLength={17}
                      disabled={isLoading}
                    />
                    {errors.vin && (
                      <p className="text-sm text-destructive">{errors.vin}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trim" style={{ color: 'var(--brand-tertiary)' }}>
                      Trim Level
                    </Label>
                    <Input
                      id="trim"
                      type="text"
                      placeholder="e.g., LX, EX, Limited"
                      value={formData.trim}
                      onChange={(e) => handleInputChange('trim')(e.target.value)}
                      className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="transmission" style={{ color: 'var(--brand-tertiary)' }}>
                      Transmission
                    </Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={handleInputChange('transmission')}
                    >
                      <SelectTrigger className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mileage" style={{ color: 'var(--brand-tertiary)' }}>
                      Current Mileage
                    </Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g., 25000"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage')(e.target.value)}
                      className={`transition-all duration-200 ${errors.mileage ? 'border-destructive' : 'border-brand-tertiary-tint-3 focus:border-brand-primary'}`}
                      disabled={isLoading}
                    />
                    {errors.mileage && (
                      <p className="text-sm text-destructive">{errors.mileage}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <Label htmlFor="nickname" style={{ color: 'var(--brand-tertiary)' }}>
                    Vehicle Nickname
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="e.g., My Daily Driver"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname')(e.target.value)}
                    className="border-brand-tertiary-tint-3 focus:border-brand-primary transition-all duration-200"
                    disabled={isLoading}
                  />
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
                      <span>Adding Vehicle...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Vehicle</span>
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
                      <span>Skip for Now</span>
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
                className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-15"
                style={{ 
                  background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
                  transform: 'translate(25%, -25%)'
                }}
              />
              <p className="text-sm relative z-10" style={{ color: 'var(--brand-tertiary)' }}>
                <span className="font-medium">Why do we need this?</span> Your vehicle information helps our AI provide 
                accurate maintenance schedules, troubleshooting advice, and personalized recommendations 
                specific to your car's make, model, and year.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
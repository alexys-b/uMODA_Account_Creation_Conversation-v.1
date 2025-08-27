// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  aiPreferences?: AIPreferences;
}

export interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}

export type AuthMode = 'signin' | 'signup';
export type ThirdPartyProvider = 'google' | 'apple';

// Vehicle Types
export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  color?: string;
  trim?: string;
  engine?: string;
  transmission?: 'Automatic' | 'Manual' | 'CVT';
  mileage?: number;
  nickname?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  vin: string;
  color: string;
  trim: string;
  engine: string;
  transmission: string;
  mileage: string;
  nickname: string;
}

// AI Personalization Types
export interface AIPreferences {
  communicationStyle: 'formal' | 'casual' | 'friendly';
  responseLength: 'brief' | 'detailed' | 'comprehensive';
  personalityTraits: string[];
  focusAreas: string[];
  notificationPreferences: {
    maintenance: boolean;
    tips: boolean;
    recalls: boolean;
  };
  preferredName?: string;
}

export interface AIPreferencesFormData {
  communicationStyle: string;
  responseLength: string;
  personalityTraits: string[];
  focusAreas: string[];
  maintenanceNotifications: boolean;
  tipsNotifications: boolean;
  recallsNotifications: boolean;
  preferredName: string;
}

// Car Makes and Models Data
export const CAR_MAKES = [
  {
    name: 'Toyota',
    models: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Sienna', 'Tacoma', 'Tundra']
  },
  {
    name: 'Honda',
    models: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Ridgeline', 'Passport', 'HR-V']
  },
  {
    name: 'Ford',
    models: ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Expedition', 'Ranger', 'Bronco']
  },
  {
    name: 'Chevrolet',
    models: ['Silverado', 'Equinox', 'Tahoe', 'Malibu', 'Traverse', 'Suburban', 'Colorado', 'Camaro']
  },
  {
    name: 'Nissan',
    models: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Titan', 'Frontier', 'Murano', 'Armada']
  },
  {
    name: 'BMW',
    models: ['3 Series', '5 Series', 'X3', 'X5', 'X1', '7 Series', 'X7', 'i4']
  },
  {
    name: 'Mercedes-Benz',
    models: ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class', 'S-Class', 'GLS', 'EQS']
  },
  {
    name: 'Audi',
    models: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'A8', 'e-tron']
  }
];

export const VEHICLE_YEARS = Array.from({ length: 25 }, (_, i) => 2024 - i);

export const VEHICLE_COLORS = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige', 'Gold', 'Orange', 'Yellow'
];

// AI Personalization Options
export const COMMUNICATION_STYLES = [
  {
    value: 'formal',
    label: 'Professional & Formal',
    description: 'Clear, precise, and business-like communication'
  },
  {
    value: 'casual',
    label: 'Casual & Relaxed',
    description: 'Conversational and approachable tone'
  },
  {
    value: 'friendly',
    label: 'Warm & Friendly',
    description: 'Enthusiastic and personable interactions'
  }
];

export const RESPONSE_LENGTHS = [
  {
    value: 'brief',
    label: 'Brief & To-the-Point',
    description: 'Quick answers and short explanations'
  },
  {
    value: 'detailed',
    label: 'Detailed & Informative',
    description: 'Thorough explanations with context'
  },
  {
    value: 'comprehensive',
    label: 'Comprehensive & Educational',
    description: 'In-depth responses with background information'
  }
];

export const PERSONALITY_TRAITS = [
  'Helpful', 'Patient', 'Encouraging', 'Analytical', 'Proactive', 'Empathetic', 'Direct', 'Supportive'
];

export const FOCUS_AREAS = [
  'Maintenance & Care', 'Performance Optimization', 'Safety & Recalls', 'Cost Savings', 
  'Environmental Impact', 'Technology Features', 'Troubleshooting', 'Upgrades & Modifications'
];
export type Language = 'en' | 'tr';

export type Gender = 'male' | 'female';

export type Goal = 'fatLoss' | 'muscleGain' | 'maintenance';

export type ActivityLevel = 'low' | 'moderate' | 'high';

export type PlanType = 'free' | 'premium';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  height: number;
  weight: number;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  plan: PlanType;
  stepGoal: number;
  profilePhoto?: string;
}

export interface DailyLog {
  date: string;
  weight?: number;
  bodyFat?: number;
  steps?: number;
  water?: number;
  calories?: number;
  protein?: number;
  note?: string;
}

export interface ChatMessage {
  id: string;
  from: 'user' | 'coach';
  text: string;
  timestamp: Date;
}
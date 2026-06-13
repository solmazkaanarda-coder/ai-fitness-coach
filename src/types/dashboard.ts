/**
 * Core dashboard data types with support for multiple data sources
 * Designed to integrate with Apple Watch, HealthKit, Google Fit, Spotify, Strava, and Premium subscriptions
 */

// ============================================================================
// HEALTH & FITNESS DATA SOURCES
// ============================================================================

/** Apple Watch and HealthKit data integration */
export interface HealthKitData {
  steps?: number;
  calories?: number;
  activeMinutes?: number;
  heartRate?: number;
  lastSyncedAt?: string;
}

/** Google Fit data integration */
export interface GoogleFitData {
  steps?: number;
  distance?: number;
  calories?: number;
  heartRate?: number;
  lastSyncedAt?: string;
}

/** Strava data integration */
export interface StravaData {
  activities?: number;
  totalDistance?: number;
  totalTime?: number;
  maxSpeed?: number;
  lastSyncedAt?: string;
}

/** Spotify listening data integration */
export interface SpotifyData {
  topGenres?: string[];
  listeningTime?: number; // minutes
  averageTempo?: number;
  lastSyncedAt?: string;
}

// ============================================================================
// WATER TRACKING
// ============================================================================

export interface WaterProgress {
  id: string;
  date: string;
  current: number; // ml consumed
  goal: number; // ml target
  percentage: number; // 0-100
  glasses?: number;
  lastUpdated: string;
}

// ============================================================================
// WORKOUT & ACTIVITY
// ============================================================================

export interface WorkoutSession {
  id: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  date: string;
  duration: number; // minutes
  caloriesBurned?: number;
  distance?: number;
  intensity: 'light' | 'moderate' | 'high';
  notes?: string;
  source?: 'manual' | 'healthkit' | 'google_fit' | 'strava';
}

export interface ProgressMetrics {
  weight?: number;
  bmi?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thigh?: number;
  };
  workoutsThisWeek: number;
  totalWorkoutsAllTime: number;
  avgCaloriesBurned?: number;
  streak: number; // consecutive days
  trend: 'improving' | 'stable' | 'declining';
}

// ============================================================================
// COACH & ANALYSIS
// ============================================================================

export interface CoachSummary {
  message: string;
  motivationLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  focusArea: 'cardio' | 'strength' | 'flexibility' | 'nutrition' | 'recovery';
  nextMilestone?: string;
  daysToMilestone?: number;
}

export interface AnalysisData {
  activityAnalysis: {
    avgWorkoutDuration: number;
    frequencyPerWeek: number;
    preferredTime: string; // 'morning' | 'afternoon' | 'evening'
    favoriteTypes: string[];
  };
  nutritionAnalysis?: {
    calorieTarget: number;
    calorieAverage: number;
    macroBreakdown: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  progressAnalysis: {
    weightTrend: number; // -5 = losing 5 lbs/month, +2 = gaining 2 lbs/month
    workoutConsistency: number; // 0-100
    improvementAreas: string[];
  };
  insights: string[];
}

// ============================================================================
// USER PROFILE
// ============================================================================

export interface ProfileSummary {
  userId: string;
  name: string;
  age?: number;
  currentWeight?: number;
  goalWeight?: number;
  height?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  joinDate: string;
  totalDaysActive: number;
  premiumSubscription?: PremiumSubscription;
  connectedServices: ConnectedServices;
}

export interface PremiumSubscription {
  active: boolean;
  tier: 'basic' | 'pro' | 'elite';
  startDate?: string;
  expiryDate?: string;
  features: string[];
  autoRenew: boolean;
}

export interface ConnectedServices {
  appleHealth?: {
    connected: boolean;
    lastSync?: string;
    permissions: string[];
  };
  healthKit?: {
    connected: boolean;
    lastSync?: string;
    permissions: string[];
  };
  googleFit?: {
    connected: boolean;
    lastSync?: string;
    permissions: string[];
  };
  strava?: {
    connected: boolean;
    lastSync?: string;
    permissions: string[];
  };
  spotify?: {
    connected: boolean;
    lastSync?: string;
    permissions: string[];
  };
}

// ============================================================================
// COMPOSITE DASHBOARD
// ============================================================================

export interface DashboardData {
  // Core data
  userId: string;
  lastUpdated: string;
  
  // Main dashboard sections
  waterProgress: WaterProgress;
  coachSummary: CoachSummary;
  progressMetrics: ProgressMetrics;
  analysisData: AnalysisData;
  profileSummary: ProfileSummary;
  
  // Recent activity
  recentWorkouts: WorkoutSession[];
  upcomingWorkouts?: WorkoutSession[];
  
  // Multi-source data
  aggregatedData?: {
    healthKit?: HealthKitData;
    googleFit?: GoogleFitData;
    strava?: StravaData;
    spotify?: SpotifyData;
  };
}

// For backward compatibility
export interface Dashboard {
  summary?: string;
}

// ============================================================================
// AUXILIARY API RESPONSES
// ============================================================================

export interface ChatResponse {
  reply: string;
}

export interface AnalyzeResponse {
  advice?: string;
  effect_label?: string;
  score?: number;
  [key: string]: any;
}

export interface ProgressAddResponse {
  progress_logs: any[];
}

export interface WaterAddResponse {
  water_ml: number;
}

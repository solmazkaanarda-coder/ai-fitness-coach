/**
 * Professional Dashboard Service Layer
 * 
 * Manages all dashboard-related API calls with typed responses.
 * Serves as the single source of truth for dashboard data retrieval.
 * Supports multiple data sources: Apple Watch, HealthKit, Google Fit, Spotify, Strava
 * 
 * Architecture: All network calls go through apiClient (see apiClient.ts)
 */

import type {
  AnalysisData,
  CoachSummary,
  DashboardData,
  GoogleFitData,
  HealthKitData,
  ProfileSummary,
  ProgressMetrics,
  SpotifyData,
  StravaData,
  WaterProgress,
  WorkoutSession,
} from '../../types/dashboard';
import apiClient from './apiClient';

// ============================================================================
// DASHBOARD SERVICE ENDPOINTS
// ============================================================================

/**
 * Retrieves the complete dashboard data in a single call
 * 
 * Returns all dashboard sections:
 * - Water progress tracking
 * - Coach motivation and recommendations
 * - Progress metrics (weight, BMI, workouts, etc.)
 * - Analysis and insights
 * - Profile summary
 * - Recent workouts
 * - Aggregated data from connected services
 */
export const getDashboard = async (): Promise<DashboardData> => {
  return apiClient.get<DashboardData>('/dashboard');
};

/**
 * Retrieves water intake tracking data for today
 * 
 * Returns:
 * - Current water consumed (ml)
 * - Daily goal (ml)
 * - Progress percentage
 * - Number of glasses
 * - Last update timestamp
 */
export const getWaterProgress = async (): Promise<WaterProgress> => {
  return apiClient.get<WaterProgress>('/dashboard/water');
};

/**
 * Retrieves AI coach summary and recommendations
 * 
 * Returns:
 * - Personalized motivational message
 * - Current motivation level
 * - Fitness recommendation for today
 * - Primary focus area suggestion
 * - Next milestone and days remaining
 */
export const getCoachSummary = async (): Promise<CoachSummary> => {
  return apiClient.get<CoachSummary>('/dashboard/coach');
};

/**
 * Retrieves comprehensive progress metrics
 * 
 * Returns:
 * - Weight and BMI trends
 * - Body composition (fat %, muscle mass)
 * - Measurements (chest, waist, hips, thigh)
 * - Workout statistics (this week, all-time, average)
 * - Current streak and overall trend
 */
export const getProgressMetrics = async (): Promise<ProgressMetrics> => {
  return apiClient.get<ProgressMetrics>('/dashboard/progress');
};

/**
 * Retrieves analysis and insights about user's fitness journey
 * 
 * Returns:
 * - Activity pattern analysis (frequency, duration, preferred time)
 * - Nutrition analysis (calorie tracking, macro breakdown)
 * - Progress analysis (trends, consistency, improvement areas)
 * - AI-generated insights and recommendations
 */
export const getAnalysisData = async (): Promise<AnalysisData> => {
  return apiClient.get<AnalysisData>('/dashboard/analysis');
};

/**
 * Retrieves user profile summary and connected services status
 * 
 * Returns:
 * - User profile information (name, age, goals, fitness level)
 * - Premium subscription status
 * - Connected health services (Apple Health, Google Fit, etc.)
 * - Last sync timestamps for each service
 */
export const getProfileSummary = async (): Promise<ProfileSummary> => {
  return apiClient.get<ProfileSummary>('/dashboard/profile');
};

// ============================================================================
// LEGACY COMPATIBILITY FUNCTION
// ============================================================================

/**
 * Legacy function for backward compatibility
 * Maps to getDashboard() internally
 * 
 * @deprecated Use getDashboard() instead
 */
export const fetchDashboard = async (): Promise<DashboardData> => {
  return getDashboard();
};

// ============================================================================
// CONNECTED SERVICES DATA RETRIEVAL (Future Implementation)
// ============================================================================

/**
 * Retrieves health data synced from Apple Watch/HealthKit
 * 
 * @returns Apple Watch/HealthKit health metrics
 */
export const getHealthKitData = async (): Promise<HealthKitData> => {
  return apiClient.get<HealthKitData>('/dashboard/integrations/healthkit');
};

/**
 * Retrieves health data synced from Google Fit
 * 
 * @returns Google Fit health metrics
 */
export const getGoogleFitData = async (): Promise<GoogleFitData> => {
  return apiClient.get<GoogleFitData>('/dashboard/integrations/google-fit');
};

/**
 * Retrieves activity data synced from Strava
 * 
 * @returns Strava activity metrics
 */
export const getStravaData = async (): Promise<StravaData> => {
  return apiClient.get<StravaData>('/dashboard/integrations/strava');
};

/**
 * Retrieves music/activity data synced from Spotify
 * 
 * @returns Spotify activity metrics
 */
export const getSpotifyData = async (): Promise<SpotifyData> => {
  return apiClient.get<SpotifyData>('/dashboard/integrations/spotify');
};

/**
 * Retrieves all recent workouts from all sources
 * 
 * @param limit - Maximum number of workouts to return (default: 10)
 * @param source - Filter by specific source ('manual' | 'healthkit' | 'google_fit' | 'strava')
 * @returns Array of recent workouts
 */
export const getRecentWorkouts = async (
  limit: number = 10,
  source?: WorkoutSession['source']
): Promise<WorkoutSession[]> => {
  const params = new URLSearchParams();
  params.append('limit', String(limit));
  if (source) {
    params.append('source', source);
  }
  return apiClient.get<WorkoutSession[]>(`/dashboard/workouts/recent?${params}`);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Service export for modular imports
 */
export default {
  // Core endpoints
  getDashboard,
  getWaterProgress,
  getCoachSummary,
  getProgressMetrics,
  getAnalysisData,
  getProfileSummary,
  
  // Legacy
  fetchDashboard,
  
  // Connected services
  getHealthKitData,
  getGoogleFitData,
  getStravaData,
  getSpotifyData,
  getRecentWorkouts,
};

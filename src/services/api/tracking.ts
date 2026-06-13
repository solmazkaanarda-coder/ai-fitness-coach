/**
 * Tracking API Service
 *
 * Connects to the /tracking/* backend endpoints.
 * All five log types: weight, water, nutrition, activity, daily.
 * Preserves compatibility with Apple Watch, HealthKit, Strava, Spotify future integrations.
 */

import apiClient from './apiClient';

// ── Request types ─────────────────────────────────────────────────────────────

export interface WeightLogRequest {
  weight: number;
  date?: string;
  note?: string;
}

export interface WaterLogRequest {
  amount: number;   // ml
  date?: string;
  note?: string;
}

export interface NutritionLogRequest {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_type?: string;
  note?: string;
  date?: string;
}

export interface ActivityLogRequest {
  type?: string;       // run / walk / gym / cycling / swim / manual
  duration?: number;   // minutes
  calories?: number;
  steps?: number;
  distance?: number;   // km
  source?: string;     // manual / healthkit / strava / watch
  date?: string;
  note?: string;
}

export interface DailyLogRequest {
  date?: string;
  weight?: number;
  water?: number;      // ml
  calories?: number;
  protein?: number;
  steps?: number;
  activity_minutes?: number;
  mood?: string;       // great / good / ok / bad
  readiness?: number;  // 0-100
  note?: string;
}

// ── Response types ────────────────────────────────────────────────────────────

export interface TrackingResponse<T = any> {
  success: boolean;
  data: T;
  log_count?: number;
  water_ml?: number;
}

export interface TrackingSummary {
  weight: { log_count: number; latest_weight: number | null };
  water: { log_count: number; total_ml: number };
  nutrition: { log_count: number; total_calories: number; total_protein: number };
  activity: { log_count: number; total_steps: number; total_minutes: number };
  daily: { log_count: number };
}

export interface ActivityLog {
  type: string;
  duration: number | null;
  calories: number | null;
  steps: number | null;
  distance: number | null;
  source: string;
  date: string;
  note: string;
}

export interface WeightLog {
  weight: number;
  date: string;
  note: string;
}

export interface WaterLog {
  amount_ml: number;
  total_ml?: number;
  time?: string;
  date?: string;
}

// ── API functions ─────────────────────────────────────────────────────────────

export const getTrackingSummary = (): Promise<TrackingResponse<TrackingSummary>> =>
  apiClient.get('/tracking/summary');

// Weight
export const addWeightLog = (data: WeightLogRequest): Promise<TrackingResponse<WeightLog>> =>
  apiClient.post('/tracking/weight', data);

export const getWeightLogs = (): Promise<TrackingResponse<WeightLog[]>> =>
  apiClient.get('/tracking/weight');

// Water (GET reads same water_logs that /water/add writes — one source of truth)
export const getWaterLogs = (): Promise<TrackingResponse<WaterLog[]>> =>
  apiClient.get('/tracking/water');

// Nutrition
export const addNutritionLog = (data: NutritionLogRequest): Promise<TrackingResponse> =>
  apiClient.post('/tracking/nutrition', data);

export const getNutritionLogs = (): Promise<TrackingResponse> =>
  apiClient.get('/tracking/nutrition');

// Activity
export const addActivityLog = (data: ActivityLogRequest): Promise<TrackingResponse<ActivityLog>> =>
  apiClient.post('/tracking/activity', data);

export const getActivityLogs = (): Promise<TrackingResponse<ActivityLog[]>> =>
  apiClient.get('/tracking/activity');

// Daily
export const addDailyLog = (data: DailyLogRequest): Promise<TrackingResponse> =>
  apiClient.post('/tracking/daily', data);

export const getDailyLogs = (): Promise<TrackingResponse> =>
  apiClient.get('/tracking/daily');

export default {
  getTrackingSummary,
  addWeightLog,
  getWeightLogs,
  getWaterLogs,
  addNutritionLog,
  getNutritionLogs,
  addActivityLog,
  getActivityLogs,
  addDailyLog,
  getDailyLogs,
};

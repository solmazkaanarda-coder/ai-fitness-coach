import type { AnalyzeResponse, ChatResponse, ProgressAddResponse, WaterAddResponse } from '../../types/dashboard';
import apiClient from './apiClient';

/**
 * Adds water for the current user
 * POST /water/add
 */
export const addWater = async (amountMl: number): Promise<WaterAddResponse> => {
  return apiClient.post<WaterAddResponse>('/water/add', { amount_ml: amountMl });
};

/**
 * Sends a message to coach/chat endpoint
 * POST /chat
 */
export const sendCoachMessage = async (message: string, language: string): Promise<ChatResponse> => {
  return apiClient.post<ChatResponse>('/chat', { message, language });
};

/**
 * Sends media for analysis
 * POST /analyze
 */
export const analyzeMedia = async (
  mediaType: 'photo' | 'video',
  plan: string,
  language: string,
  note?: string
): Promise<AnalyzeResponse> => {
  return apiClient.post<AnalyzeResponse>('/analyze', {
    media_type: mediaType,
    plan,
    language,
    note,
  });
};

/**
 * Adds a progress log entry
 * POST /progress/add
 */
export const addProgressLog = async (progressLog: any): Promise<ProgressAddResponse> => {
  return apiClient.post<ProgressAddResponse>('/progress/add', progressLog);
};

/**
 * Fetches the full dashboard state
 * GET /dashboard
 */
export const loadDashboard = async (): Promise<any> => {
  return apiClient.get('/dashboard');
};

/**
 * Logs today's calorie and protein intake
 * POST /daily/intake
 */
export const logDailyIntake = async (caloriesConsumed: number, proteinConsumed: number): Promise<any> => {
  return apiClient.post('/daily/intake', {
    calories_consumed: caloriesConsumed,
    protein_consumed: proteinConsumed,
  });
};

export default {
  addWater,
  sendCoachMessage,
  analyzeMedia,
  addProgressLog,
  loadDashboard,
  logDailyIntake,
};

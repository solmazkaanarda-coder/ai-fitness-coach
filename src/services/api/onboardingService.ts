/**
 * Onboarding Service Layer
 * 
 * Manages onboarding-specific API calls (plan creation, language settings).
 * Uses apiClient as the only network layer.
 */

import apiClient from './apiClient';

/**
 * Creates a user plan during onboarding
 * POST /create-plan
 */
export const createUserPlan = async (payload: {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  target_weight: number | null;
  goal: string;
  activity_level: string;
  plan: string;
  step_goal: number;
}): Promise<any> => {
  return apiClient.post('/create-plan', payload);
};

/**
 * Sets user language preference
 * POST /language
 */
export const setLanguage = async (language: string): Promise<any> => {
  return apiClient.post('/language', { language });
};

export default {
  createUserPlan,
  setLanguage,
};

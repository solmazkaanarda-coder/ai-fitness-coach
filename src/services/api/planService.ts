import apiClient from './apiClient';

export const fetchPlans = async () => {
  return apiClient.get('/plans');
};

export const createPlan = async (payload: any) => {
  return apiClient.post('/plans', payload);
};

export default { fetchPlans, createPlan };

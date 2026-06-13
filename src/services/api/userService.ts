import apiClient from './apiClient';

export const getUser = async (userId: string) => {
  return apiClient.get(`/users/${userId}`);
};

export const updateUser = async (userId: string, payload: any) => {
  return apiClient.post(`/users/${userId}`, payload);
};

export default { getUser, updateUser };

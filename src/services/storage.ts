import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, DailyLog, UserProfile } from '../types/app';

const USER_PROFILE_KEY = 'userProfile';
const DAILY_LOGS_KEY = 'dailyLogs';
const CHAT_MESSAGES_KEY = 'chatMessages';

export const storage = {
  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  },

  // Daily Logs
  async saveDailyLogs(logs: DailyLog[]): Promise<void> {
    try {
      await AsyncStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save daily logs:', error);
    }
  },

  async getDailyLogs(): Promise<DailyLog[]> {
    try {
      const data = await AsyncStorage.getItem(DAILY_LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load daily logs:', error);
      return [];
    }
  },

  // Chat Messages
  async saveChatMessages(messages: ChatMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat messages:', error);
    }
  },

  async getChatMessages(): Promise<ChatMessage[]> {
    try {
      const data = await AsyncStorage.getItem(CHAT_MESSAGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      return [];
    }
  },
};
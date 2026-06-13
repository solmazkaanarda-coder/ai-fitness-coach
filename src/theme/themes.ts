export type ThemeName = 'aquaCore' | 'sandElite' | 'darkFuture' | 'roseGlow' | 'premiumAthlete';

export type AppTheme = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  cardSoft: string;
  text: string;
  mutedText: string;
  border: string;
  // Premium accent colors
  successColor?: string;
  calorieColor?: string;
  proteinColor?: string;
  waterColor?: string;
  progressColor?: string;
};

export const THEMES: Record<ThemeName, AppTheme> = {
  aquaCore: {
    primary: '#2F9BFF',
    secondary: '#6EC6FF',
    background: '#05070A',
    card: '#121826',
    cardSoft: '#172033',
    text: '#FFFFFF',
    mutedText: '#9CA3AF',
    border: '#2F9BFF',
  },
  sandElite: {
    primary: '#9A6A3A',
    secondary: '#C8A47A',
    background: '#F4EFE8',
    card: '#E7DED3',
    cardSoft: '#EFE7DC',
    text: '#1F2933',
    mutedText: '#8A7A6A',
    border: '#9A6A3A',
  },
  darkFuture: {
    primary: '#FF8A00',
    secondary: '#2F9BFF',
    background: '#020409',
    card: '#111827',
    cardSoft: '#161F2E',
    text: '#FFFFFF',
    mutedText: '#9CA3AF',
    border: '#FF8A00',
  },
  roseGlow: {
    primary: '#FF4FA3',
    secondary: '#FFB3D9',
    background: '#FFF1F7',
    card: '#FFE0EC',
    cardSoft: '#FFF7FA',
    text: '#2A1020',
    mutedText: '#9B6A80',
    border: '#FF4FA3',
  },
  premiumAthlete: {
    primary: '#2F9BFF',
    secondary: '#6EC6FF',
    background: '#0F1117',
    card: '#1A1E27',
    cardSoft: '#242A35',
    text: '#FFFFFF',
    mutedText: '#A8AFBB',
    border: '#2A3038',
    // Premium accent colors
    successColor: '#A4D65E',
    calorieColor: '#F4A860',
    proteinColor: '#7FE4D9',
    waterColor: '#60B4FF',
    progressColor: '#D4A5FF',
  },
};
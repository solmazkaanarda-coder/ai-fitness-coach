// Backwards-compatible theme type matching `AppTheme` used across the app
export type Theme = {
  themeName?: string;
  primary: string;
  secondary: string;
  background: string;
  card: string;
  cardSoft?: string;
  text: string;
  mutedText: string;
  border: string;
  // optional premium accent colors
  successColor?: string;
  calorieColor?: string;
  proteinColor?: string;
  waterColor?: string;
  progressColor?: string;
};

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface AppCardProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'soft';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const { theme } = useAppTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: variant === 'soft' ? theme.cardSoft : theme.card,
      borderColor: theme.border,
    },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
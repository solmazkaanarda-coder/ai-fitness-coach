import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { AppCard } from './AppCard';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  onPress,
}) => {
  const { theme } = useAppTheme();

  return (
    <AppCard style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
      <Text style={[styles.value, { color: theme.primary }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>{subtitle}</Text>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
});
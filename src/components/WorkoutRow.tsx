import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface WorkoutRowProps {
  activityType: string;
  icon: string;
  duration?: string;
  distance?: string;
  calories?: string;
  onPress?: () => void;
}

export const WorkoutRow: React.FC<WorkoutRowProps> = ({
  activityType,
  icon,
  duration,
  distance,
  calories,
  onPress,
}) => {
  const { theme } = useAppTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardSoft,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textSection}>
          <Text style={[styles.activityType, { color: theme.text }]}>{activityType}</Text>
          <View style={styles.metaRow}>
            {duration && (
              <Text style={[styles.meta, { color: theme.mutedText }]}>⏱ {duration}</Text>
            )}
            {distance && (
              <Text style={[styles.meta, { color: theme.mutedText }]}>📍 {distance}</Text>
            )}
          </View>
        </View>
      </View>

      {calories && (
        <Text style={[styles.calories, { color: (theme as any).calorieColor || '#F4A860' }]}>
          {calories}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  icon: {
    fontSize: 28,
  },
  textSection: {
    flex: 1,
  },
  activityType: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
  },
  calories: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});

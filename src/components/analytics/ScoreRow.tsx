/**
 * Compact 4-score strip for the dashboard.
 * Shows: Hydration | Nutrition | Activity | Streak
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import type { AppTheme } from '../../theme/themes';

interface ScoreItem {
  icon: string;
  label: string;
  value: number | string;
  unit?: string;
  color: string;
}

interface ScoreRowProps {
  hydrationScore: number;
  nutritionScore: number;
  activityScore: number;
  streak: number;
  hydrationLabel: string;
  nutritionLabel: string;
  activityLabel: string;
  streakLabel: string;
  daysLabel: string;
}

function scoreColor(score: number, theme: AppTheme): string {
  if (score >= 75) return (theme as any).successColor ?? '#A4D65E';
  if (score >= 45) return (theme as any).calorieColor ?? '#F4A860';
  return '#FF6B6B';
}

export const ScoreRow: React.FC<ScoreRowProps> = ({
  hydrationScore,
  nutritionScore,
  activityScore,
  streak,
  hydrationLabel,
  nutritionLabel,
  activityLabel,
  streakLabel,
  daysLabel,
}) => {
  const { theme } = useAppTheme();

  const items: ScoreItem[] = [
    {
      icon: '💧',
      label: hydrationLabel,
      value: hydrationScore,
      unit: '',
      color: scoreColor(hydrationScore, theme),
    },
    {
      icon: '🍎',
      label: nutritionLabel,
      value: nutritionScore,
      unit: '',
      color: scoreColor(nutritionScore, theme),
    },
    {
      icon: '⚡',
      label: activityLabel,
      value: activityScore,
      unit: '',
      color: scoreColor(activityScore, theme),
    },
    {
      icon: '🔥',
      label: streakLabel,
      value: streak,
      unit: daysLabel,
      color: streak >= 3 ? ((theme as any).successColor ?? '#A4D65E') : theme.mutedText,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {items.map((item, i) => (
        <View
          key={i}
          style={[
            styles.item,
            i < items.length - 1 && { borderRightWidth: 1, borderRightColor: theme.border },
          ]}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={[styles.value, { color: item.color }]}>
            {item.value}
          </Text>
          <Text style={[styles.label, { color: theme.mutedText }]} numberOfLines={1}>
            {item.unit ? `${item.unit}` : item.label}
          </Text>
          {item.unit ? (
            <Text style={[styles.sublabel, { color: theme.mutedText }]} numberOfLines={1}>
              {item.label}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 18,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  sublabel: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
});

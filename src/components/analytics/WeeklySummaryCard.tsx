/**
 * Weekly Summary Card.
 * Shows 7-day averages for weight, calories, protein, and total activity.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import type { WeeklyStats } from '../../utils/analyticsCalcs';

interface WeeklySummaryCardProps {
  stats: WeeklyStats;
  title: string;
  noDataText: string;
  labels: {
    avgWeight: string;
    avgCalories: string;
    avgProtein: string;
    totalActivity: string;
    daysLogged: string;
    minutes: string;
    days: string;
  };
}

interface StatRowProps {
  label: string;
  value: string;
  color: string;
  mutedColor: string;
}

const StatRow: React.FC<StatRowProps> = ({ label, value, color, mutedColor }) => (
  <View style={styles.statRow}>
    <Text style={[styles.statLabel, { color: mutedColor }]}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
  stats,
  title,
  noDataText,
  labels,
}) => {
  const { theme } = useAppTheme();
  const hasData =
    stats.avgWeight !== null ||
    stats.avgCalories !== null ||
    stats.totalActivityMinutes > 0 ||
    stats.daysLogged > 0;

  if (!hasData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.empty, { color: theme.mutedText }]}>{noDataText}</Text>
      </View>
    );
  }

  const accent = (theme as any).waterColor ?? theme.primary;
  const calColor = (theme as any).calorieColor ?? '#F4A860';
  const protColor = (theme as any).proteinColor ?? '#7FE4D9';
  const actColor = (theme as any).successColor ?? '#A4D65E';

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Text style={[styles.badgeText, { color: theme.mutedText }]}>
            {stats.daysLogged} {labels.days}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {stats.avgWeight !== null && (
        <StatRow
          label={labels.avgWeight}
          value={`${stats.avgWeight} kg`}
          color={theme.text}
          mutedColor={theme.mutedText}
        />
      )}
      {stats.avgCalories !== null && (
        <StatRow
          label={labels.avgCalories}
          value={`${stats.avgCalories} kcal`}
          color={calColor}
          mutedColor={theme.mutedText}
        />
      )}
      {stats.avgProtein !== null && (
        <StatRow
          label={labels.avgProtein}
          value={`${stats.avgProtein} g`}
          color={protColor}
          mutedColor={theme.mutedText}
        />
      )}
      {stats.totalActivityMinutes > 0 && (
        <StatRow
          label={labels.totalActivity}
          value={`${stats.totalActivityMinutes} ${labels.minutes}`}
          color={actColor}
          mutedColor={theme.mutedText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginBottom: 14,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  empty: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});

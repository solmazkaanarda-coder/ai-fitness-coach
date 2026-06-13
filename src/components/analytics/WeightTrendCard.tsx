/**
 * Weight Trend Card.
 * Shows latest weight, change from previous, trend direction,
 * and a sparkline bar chart built from pure View components.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import type { TrendDirection, WeightTrendResult } from '../../utils/analyticsCalcs';

interface WeightTrendCardProps {
  trend: WeightTrendResult;
  title: string;
  noDataText: string;
}

const TREND_ARROW: Record<TrendDirection, string> = {
  down: '↓',
  up: '↑',
  stable: '→',
  nodata: '',
};

function trendColor(dir: TrendDirection, theme: any): string {
  if (dir === 'down') return (theme as any).successColor ?? '#A4D65E';
  if (dir === 'up') return '#FF6B6B';
  return theme.mutedText;
}

const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return (
    <View style={sparkStyles.chart}>
      {values.map((v, i) => {
        const pct = (v - min) / range;
        const height = Math.max(4, Math.round(pct * 36));
        const isLatest = i === values.length - 1;
        return (
          <View
            key={i}
            style={[
              sparkStyles.bar,
              {
                height,
                backgroundColor: color,
                opacity: isLatest ? 1 : 0.25 + (i / values.length) * 0.45,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const sparkStyles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 44,
    gap: 4,
    flex: 1,
    marginLeft: 16,
  },
  bar: {
    flex: 1,
    borderRadius: 4,
  },
});

export const WeightTrendCard: React.FC<WeightTrendCardProps> = ({ trend, title, noDataText }) => {
  const { theme } = useAppTheme();
  const color = trendColor(trend.direction, theme);
  const arrow = TREND_ARROW[trend.direction];

  if (trend.direction === 'nodata') {
    return (
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.empty, { color: theme.mutedText }]}>{noDataText}</Text>
      </View>
    );
  }

  const changeSign = trend.change > 0 ? '+' : '';

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

      <View style={styles.row}>
        <View>
          <Text style={[styles.latestWeight, { color: theme.text }]}>
            {trend.latest} <Text style={[styles.unit, { color: theme.mutedText }]}>kg</Text>
          </Text>
          {trend.previous !== null && (
            <View style={styles.changeRow}>
              <Text style={[styles.arrow, { color }]}>{arrow}</Text>
              <Text style={[styles.change, { color }]}>
                {changeSign}{trend.change} kg
              </Text>
            </View>
          )}
        </View>

        <Sparkline values={trend.sparkline} color={color} />
      </View>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  latestWeight: {
    fontSize: 32,
    fontWeight: '900',
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '900',
  },
  change: {
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});

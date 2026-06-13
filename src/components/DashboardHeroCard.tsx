import { tFor } from '@/src/i18n';
import { useLanguage } from '@/src/i18n/LanguageContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { ProgressBar } from './ProgressBar';

interface MetricRow {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface DashboardHeroCardProps {
  score: number;
  maxScore?: number;
  metrics: MetricRow[];
  subText?: string;
}

export const DashboardHeroCard: React.FC<DashboardHeroCardProps> = ({
  score,
  maxScore = 100,
  metrics,
  subText,
}) => {
  const { theme } = useAppTheme();
  const { lang } = useLanguage();
  const t = tFor(lang);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Hero Score Section */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreNumber, { color: theme.text }]}>{score}</Text>
          <Text style={[styles.scoreMax, { color: theme.mutedText }]}>/{maxScore}</Text>
        </View>
        <View style={styles.scoreLabel}>
          <Text style={[styles.scoreTitleText, { color: theme.text }]}>{t.dailyReadiness}</Text>
          <Text style={[styles.scoreSubText, { color: theme.mutedText }]}>
            {subText ?? t.performingWell}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Metrics Rows */}
      <View style={styles.metricsSection}>
        {metrics.map((metric, index) => (
          <View key={index} style={[styles.metricRow, index > 0 && styles.metricRowSpaced]}>
            <View style={styles.metricInfo}>
              <Text style={[styles.metricLabel, { color: theme.mutedText }]}>
                {metric.label}
              </Text>
              <Text style={[styles.metricValue, { color: metric.color }]}>
                {metric.current} / {metric.target} {metric.unit}
              </Text>
            </View>
            <ProgressBar
              value={metric.current}
              maxValue={metric.target}
              color={metric.color}
              height={6}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: -4,
  },
  scoreLabel: {
    flex: 1,
  },
  scoreTitleText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreSubText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  metricsSection: {
    gap: 12,
  },
  metricRow: {
    gap: 12,
  },
  metricRowSpaced: {
    marginTop: 4,
  },
  metricInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});

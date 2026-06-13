import { tFor } from '@/src/i18n';
import { useLanguage } from '@/src/i18n/LanguageContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { ProgressBar } from './ProgressBar';

interface TargetWeightCardProps {
  currentWeight: number;
  targetWeight: number | null;
  startingWeight?: number;
}

export const TargetWeightCard: React.FC<TargetWeightCardProps> = ({
  currentWeight,
  targetWeight,
  startingWeight,
}) => {
  const { theme } = useAppTheme();
  const { lang } = useLanguage();
  const t = tFor(lang);

  const hasTarget = targetWeight !== null && targetWeight !== undefined;
  const startW = startingWeight ?? currentWeight;

  // Direction: are we trying to decrease (fat loss) or increase (muscle gain)?
  const isDecreasing = hasTarget && startW > targetWeight!;

  const totalJourney = hasTarget ? Math.abs(startW - targetWeight!) : 0;
  const alreadyDone = hasTarget ? Math.abs(startW - currentWeight) : 0;
  const remaining = hasTarget ? Math.abs(currentWeight - targetWeight!) : 0;

  const progressPct = hasTarget && totalJourney > 0
    ? Math.min(100, Math.round((alreadyDone / totalJourney) * 100))
    : 0;

  const isGoalReached = hasTarget && (
    isDecreasing ? currentWeight <= targetWeight! : currentWeight >= targetWeight!
  );

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
      <Text style={[styles.title, { color: theme.text }]}>{t.weightProgress}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={[styles.statLabel, { color: theme.mutedText }]}>{t.current}</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {currentWeight > 0 ? `${currentWeight.toFixed(1)} kg` : '—'}
          </Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={[styles.statLabel, { color: theme.mutedText }]}>{t.target}</Text>
          <Text style={[styles.statValue, { color: hasTarget ? ((theme as any).progressColor || theme.primary) : theme.mutedText }]}>
            {hasTarget ? `${targetWeight!.toFixed(1)} kg` : t.setTarget}
          </Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={[styles.statLabel, { color: theme.mutedText }]}>{t.remaining}</Text>
          <Text style={[styles.statValue, { color: hasTarget ? ((theme as any).successColor || '#A4D65E') : theme.mutedText }]}>
            {hasTarget ? `${remaining.toFixed(1)} kg` : '—'}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.mutedText }]}>{t.overallProgress}</Text>
          <Text style={[styles.progressPercent, { color: (theme as any).progressColor || theme.primary }]}>
            {!hasTarget ? '—' : isGoalReached ? t.goalReached : `${progressPct}%`}
          </Text>
        </View>
        <ProgressBar
          value={alreadyDone}
          maxValue={Math.max(totalJourney, 0.1)}
          color={(theme as any).progressColor || theme.primary}
          height={8}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  statBlock: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
});

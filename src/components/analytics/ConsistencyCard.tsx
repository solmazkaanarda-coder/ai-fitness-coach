/**
 * Consistency Streak Card.
 * Shows current streak and all-time best streak.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import type { StreakResult } from '../../utils/analyticsCalcs';

interface ConsistencyCardProps {
  streak: StreakResult;
  title: string;
  currentLabel: string;
  bestLabel: string;
  daysLabel: string;
  buildLabel: string;
}

export const ConsistencyCard: React.FC<ConsistencyCardProps> = ({
  streak,
  title,
  currentLabel,
  bestLabel,
  daysLabel,
  buildLabel,
}) => {
  const { theme } = useAppTheme();
  const fireColor = (theme as any).successColor ?? '#A4D65E';
  const dimColor = theme.mutedText;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.block}>
          <Text style={[styles.big, { color: streak.current > 0 ? fireColor : dimColor }]}>
            {streak.current}
          </Text>
          <Text style={[styles.sublabel, { color: dimColor }]}>
            {daysLabel}
          </Text>
          <Text style={[styles.sublabel, { color: dimColor }]}>{currentLabel}</Text>
        </View>

        <View style={[styles.sep, { backgroundColor: theme.border }]} />

        <View style={styles.block}>
          <Text style={[styles.big, { color: theme.text }]}>{streak.best}</Text>
          <Text style={[styles.sublabel, { color: dimColor }]}>{daysLabel}</Text>
          <Text style={[styles.sublabel, { color: dimColor }]}>{bestLabel}</Text>
        </View>
      </View>

      {streak.current === 0 && (
        <Text style={[styles.hint, { color: dimColor }]}>{buildLabel}</Text>
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  flame: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  block: {
    flex: 1,
    alignItems: 'center',
  },
  sep: {
    width: 1,
    height: 56,
    marginHorizontal: 16,
  },
  big: {
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
  },
  sublabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 14,
    textAlign: 'center',
  },
});

import { Language, tFor } from '@/src/i18n';
import { QuickActionButton } from '@/src/components/QuickActionButton';
import type { AppTheme } from '@/src/theme/themes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DashboardQuickActionsProps {
  theme: AppTheme;
  onWaterPress: () => void;
  onMealPress: () => void;
  onWorkoutPress: () => void;
  onWeightPress: () => void;
  lang: Language;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  theme,
  onWaterPress,
  onMealPress,
  onWorkoutPress,
  onWeightPress,
  lang,
}) => {
  const styles = createStyles(theme);

  const t = tFor(lang);

  return (
    <View style={styles.quickActionsSection}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t.quickActions}
      </Text>
      <View style={styles.quickActionsGrid}>
        <QuickActionButton
          label={t.addWater}
          icon="💧"
          onPress={onWaterPress}
        />
        <QuickActionButton
          label={t.logMeal}
          icon="🍽️"
          onPress={onMealPress}
        />
        <QuickActionButton
          label={t.startWorkout}
          icon="⚡"
          onPress={onWorkoutPress}
        />
        <QuickActionButton
          label={t.updateWeight}
          icon="⚖️"
          onPress={onWeightPress}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    quickActionsSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 14,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
  });

import { Language, tFor } from '@/src/i18n';
import { WorkoutRow } from '@/src/components/WorkoutRow';
import type { AppTheme } from '@/src/theme/themes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Workout {
  activityType: string;
  icon: string;
  duration: string;
  distance?: string;
  calories: string;
}

interface DashboardRecentActivitiesProps {
  theme: AppTheme;
  workouts: Workout[];
  onWorkoutPress: () => void;
  lang: Language;
}

export const DashboardRecentActivities: React.FC<DashboardRecentActivitiesProps> = ({
  theme,
  workouts,
  onWorkoutPress,
  lang,
}) => {
  const styles = createStyles(theme);

  const t = tFor(lang);

  return (
    <View style={styles.activitiesSection}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t.recentActivities}
      </Text>
      {workouts.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.mutedText }]}>
          {t.noActivitiesYet}
        </Text>
      ) : (
        workouts.map((workout, index) => (
          <WorkoutRow
            key={index}
            activityType={workout.activityType}
            icon={workout.icon}
            duration={workout.duration}
            distance={workout.distance}
            calories={workout.calories}
            onPress={onWorkoutPress}
          />
        ))
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    activitiesSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 14,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: '500',
      paddingVertical: 8,
    },
  });

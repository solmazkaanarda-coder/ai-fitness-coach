import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface ProgressBarProps {
  value: number;
  maxValue: number;
  color?: string;
  height?: number;
  borderRadius?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue,
  color,
  height = 8,
  borderRadius = 4,
}) => {
  const { theme } = useAppTheme();
  const percentage = Math.min(100, (value / maxValue) * 100);
  const barColor = color || theme.primary;

  return (
    <View style={[styles.container, { height, borderRadius, backgroundColor: theme.cardSoft }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${percentage}%`,
            height,
            borderRadius,
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

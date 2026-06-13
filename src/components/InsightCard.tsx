import { tFor } from '@/src/i18n';
import { useLanguage } from '@/src/i18n/LanguageContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import type { Insight } from '../utils/insights';

interface InsightCardProps {
  message?: string;
  insights?: Insight[];
  onButtonPress?: () => void;
  buttonLabel?: string;
}

const TYPE_COLOR: Record<Insight['type'], string> = {
  positive: '#A4D65E',
  warning: '#F4A860',
  neutral: '#2F9BFF',
};

export const InsightCard: React.FC<InsightCardProps> = ({
  message,
  insights,
  onButtonPress,
  buttonLabel,
}) => {
  const { theme } = useAppTheme();
  const { lang } = useLanguage();
  const t = tFor(lang);
  const btnLabel = buttonLabel ?? t.askCoach;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardSoft, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>✨</Text>
        <Text style={[styles.title, { color: theme.text }]}>{t.aiCoachInsight}</Text>
      </View>

      {/* Multi-insight mode */}
      {insights && insights.length > 0 ? (
        <View style={styles.insightList}>
          {insights.map((insight, i) => (
            <View
              key={i}
              style={[
                styles.insightRow,
                i > 0 && { marginTop: 10 },
                { borderLeftColor: TYPE_COLOR[insight.type] },
              ]}
            >
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <Text style={[styles.insightText, { color: theme.mutedText }]}>
                {insight.text}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        /* Legacy single-message mode */
        <Text style={[styles.message, { color: theme.mutedText }]}>{message ?? ''}</Text>
      )}

      {onButtonPress && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={onButtonPress}
        >
          <Text style={styles.buttonText}>{btnLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  icon: { fontSize: 20 },
  title: { fontSize: 16, fontWeight: '700' },
  insightList: {},
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    paddingLeft: 10,
    gap: 8,
  },
  insightIcon: { fontSize: 14, marginTop: 1 },
  insightText: { fontSize: 13, fontWeight: '500', lineHeight: 19, flex: 1 },
  message: { fontSize: 14, fontWeight: '500', lineHeight: 20, marginBottom: 12 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

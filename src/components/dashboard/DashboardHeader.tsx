import { Language, tFor } from '@/src/i18n';
import type { AppTheme } from '@/src/theme/themes';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DashboardHeaderProps {
  name: string;
  theme: AppTheme;
  onSettingsPress: () => void;
  lang: Language;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  name,
  theme,
  onSettingsPress,
  lang,
}) => {
  const styles = createStyles(theme);

  const t = tFor(lang);

  return (
    <View style={styles.headerSection}>
      <View>
        <Text style={[styles.greeting, { color: theme.text }]}>
          {t.hello}, {name} 👋
        </Text>
        <Text style={[styles.greetingSubtext, { color: theme.mutedText }]}>
          {t.today}
        </Text>
      </View>
      <TouchableOpacity onPress={onSettingsPress}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
    },
    greeting: {
      fontSize: 32,
      fontWeight: '900',
      color: theme.text,
      marginBottom: 4,
    },
    greetingSubtext: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.mutedText,
      lineHeight: 20,
    },
    settingsIcon: {
      fontSize: 28,
      padding: 8,
    },
  });

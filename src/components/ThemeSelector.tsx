import { tFor } from '@/src/i18n';
import { useLanguage } from '@/src/i18n/LanguageContext';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { ThemeName, THEMES } from '../theme/themes';

interface ThemeSelectorProps {
  onThemeChange?: (theme: ThemeName) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange }) => {
  const { theme, themeName, setThemeName } = useAppTheme();
  const { lang } = useLanguage();
  const t = tFor(lang);

  const handleThemeChange = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    onThemeChange?.(newTheme);
  };

  const themeOptions: { key: ThemeName; label: string; description: string }[] = [
    { key: 'darkFuture', label: t.themeDarkFuture, description: t.themeDarkFutureDesc },
    { key: 'aquaCore', label: t.themeAquaCore, description: t.themeAquaCoreDesc },
    { key: 'sandElite', label: t.themeSandElite, description: t.themeSandEliteDesc },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{t.themeSelection}</Text>
      {themeOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.option,
            {
              backgroundColor: themeName === option.key ? theme.primary : theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => handleThemeChange(option.key)}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionLabel, { color: theme.text }]}>
              {option.label}
            </Text>
            <Text style={[styles.optionDescription, { color: theme.mutedText }]}>
              {option.description}
            </Text>
          </View>
          {themeName === option.key && (
            <Text style={[styles.checkmark, { color: theme.text }]}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
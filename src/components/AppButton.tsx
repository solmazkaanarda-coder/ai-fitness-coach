import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
}) => {
  const { theme } = useAppTheme();

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    if (disabled) {
      baseStyle.push(styles.disabled as any);
    } else {
      switch (variant) {
        case 'primary':
          baseStyle.push({ backgroundColor: theme.primary } as any);
          break;
        case 'secondary':
          baseStyle.push({ backgroundColor: theme.secondary } as any);
          break;
        case 'outline':
          baseStyle.push(styles.outline as any, { borderColor: theme.primary } as any);
          break;
      }
    }
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[size]];
    if (disabled) {
      baseStyle.push(styles.disabledText as any);
    } else if (variant === 'outline') {
      baseStyle.push({ color: theme.primary } as any);
    } else {
      baseStyle.push({ color: theme.text } as any);
    }
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.text} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.7,
  },
});
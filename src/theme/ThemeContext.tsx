import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppTheme, ThemeName, THEMES } from './themes';

type ThemeContextType = {
  theme: AppTheme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'selectedTheme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>('aquaCore');

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (!mounted) return;

        if (storedTheme && THEMES[storedTheme as ThemeName]) {
          setThemeNameState(storedTheme as ThemeName);
        } else {
          setThemeNameState('aquaCore');
          await AsyncStorage.setItem(THEME_STORAGE_KEY, 'aquaCore');
        }
      } catch (error) {
        if (mounted) {
          setThemeNameState('aquaCore');
        }
      }
    };

    loadTheme();
    return () => {
      mounted = false;
    };
  }, []);

  const setThemeName = async (name: ThemeName) => {
    setThemeNameState(name);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
    } catch {
      // ignore storage write failure and keep in-memory theme
    }
  };

  const theme = THEMES[themeName] ?? THEMES.aquaCore;

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
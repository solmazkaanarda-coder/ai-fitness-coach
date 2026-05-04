import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AppTheme, ThemeName, THEMES } from './themes';

type ThemeContextType = {
  theme: AppTheme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('darkFuture');

  const theme = THEMES[themeName];

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
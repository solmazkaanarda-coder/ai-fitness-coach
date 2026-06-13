import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'tr' | 'en' | 'de' | 'ru' | 'es' | 'ar';
const STORAGE_KEY = '@ai_fitness_language_v1';

type LanguageContextValue = {
  lang: Language;
  setLang: (l: Language) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'tr',
  setLang: async () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>('tr');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && (['tr', 'en', 'de', 'ru', 'es', 'ar'] as string[]).includes(stored)) {
          setLangState(stored as Language);
        }
      } catch (e) {
        console.warn('[Language] Failed to restore language', e);
      }
    })();
  }, []);

  const setLang = async (l: Language) => {
    try {
      setLangState(l);
      await AsyncStorage.setItem(STORAGE_KEY, l);
    } catch (e) {
      console.warn('[Language] Failed to save language', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;

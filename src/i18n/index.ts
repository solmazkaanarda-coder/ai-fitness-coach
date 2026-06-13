import ar from './translations/ar';
import de from './translations/de';
import en from './translations/en';
import es from './translations/es';
import ru from './translations/ru';
import tr from './translations/tr';

export type Language = 'tr' | 'en' | 'de' | 'ru' | 'es' | 'ar';

export const translations: Record<Language, Record<string, string>> = {
  tr,
  en,
  de,
  ru,
  es,
  ar,
};

// Fallback order: requested language → English → key name (never renders blank)
export const tFor = (lang: Language): Record<string, string> => {
  const dict = translations[lang] ?? {};
  const fallback = translations.en;
  return new Proxy(dict, {
    get: (target, key: string | symbol) => {
      if (typeof key !== 'string') return undefined;
      return target[key] ?? fallback[key] ?? key;
    },
  });
};

export default {
  translations,
  tFor,
};

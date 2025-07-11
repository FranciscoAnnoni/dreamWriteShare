import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language, Translations } from './types';
import { englishTranslations } from './en';
import { spanishTranslations } from './es';

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationsMap: Record<Language, Translations> = {
  en: englishTranslations,
  es: spanishTranslations,
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0] as Language;
  return ['en', 'es'].includes(browserLang) ? browserLang : 'en';
};

const getInitialLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem('dreamWriteShare_language') as Language;
    if (savedLanguage && ['en', 'es'].includes(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Error reading language from localStorage:', error);
  }
  
  return detectBrowserLanguage();
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Translations>(translationsMap[getInitialLanguage()]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setTranslations(translationsMap[newLanguage]);
    
    try {
      localStorage.setItem('dreamWriteShare_language', newLanguage);
      console.log(`🌐 Idioma cambiado a: ${newLanguage}`);
    } catch (error) {
      console.warn('Error saving language to localStorage:', error);
    }
  };

  useEffect(() => {
    setTranslations(translationsMap[language]);
  }, [language]);

  const contextValue: LanguageContextType = {
    language,
    translations,
    setLanguage,
    t: translations,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = (): Translations => {
  const { translations } = useLanguage();
  return translations;
};

export const useT = () => {
  const { t } = useLanguage();
  return t;
};

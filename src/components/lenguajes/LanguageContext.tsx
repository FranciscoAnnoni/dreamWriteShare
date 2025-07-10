import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language, Translations } from './types';
import { englishTranslations } from './en';
import { spanishTranslations } from './es';

// Contexto del idioma
interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: Translations; // Alias para translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Mapa de traducciones
const translationsMap: Record<Language, Translations> = {
  en: englishTranslations,
  es: spanishTranslations,
};

// Hook personalizado para usar el contexto de idioma
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Función para detectar el idioma del navegador
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0] as Language;
  return ['en', 'es'].includes(browserLang) ? browserLang : 'en';
};

// Función para obtener idioma guardado o detectar automáticamente
const getInitialLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem('dreamWriteShare_language') as Language;
    if (savedLanguage && ['en', 'es'].includes(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Error reading language from localStorage:', error);
  }
  
  // Fallback a detección automática
  return detectBrowserLanguage();
};

// Proveedor del contexto de idioma
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Translations>(translationsMap[getInitialLanguage()]);

  // Función para cambiar idioma
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setTranslations(translationsMap[newLanguage]);
    
    // Guardar en localStorage
    try {
      localStorage.setItem('dreamWriteShare_language', newLanguage);
      console.log(`🌐 Idioma cambiado a: ${newLanguage}`);
    } catch (error) {
      console.warn('Error saving language to localStorage:', error);
    }
  };

  // Efecto para actualizar traducciones cuando cambia el idioma
  useEffect(() => {
    setTranslations(translationsMap[language]);
  }, [language]);

  const contextValue: LanguageContextType = {
    language,
    translations,
    setLanguage,
    t: translations, // Alias para facilitar el uso
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook simplificado para obtener solo las traducciones
export const useTranslations = (): Translations => {
  const { translations } = useLanguage();
  return translations;
};

// Hook simplificado para obtener traducción con alias 't'
export const useT = () => {
  const { t } = useLanguage();
  return t;
};

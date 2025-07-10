// Archivo principal para exportar todo el sistema de idiomas
export * from './types';
export * from './en';
export * from './es';
export * from './LanguageContext';

// Re-exportar hooks principales para facilitar el uso
export { useLanguage, useTranslations, useT, LanguageProvider } from './LanguageContext';

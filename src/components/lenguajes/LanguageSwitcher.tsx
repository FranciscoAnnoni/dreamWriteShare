import React from 'react';
import { IconButton } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useLanguage } from '../lenguajes';

interface LanguageSwitcherProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  size = 'medium',
  className = '' 
}) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  const getCurrentLanguageFlag = () => {
    return language === 'en' ? '🇺🇸' : '🇪🇸';
  };

  return (
    <IconButton
      onClick={toggleLanguage}
      size={size}
      className={`language-switcher ${className}`}
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Español' : 'English'}`}
      sx={{
        color: 'var(--color-text-secondary)',
        '&:hover': {
          backgroundColor: 'var(--color-hover)',
          color: 'var(--color-text-primary)'
        },
        fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.2rem',
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ 
        fontSize: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {getCurrentLanguageFlag()}
        <Language sx={{ fontSize: '0.8em', opacity: 0.7 }} />
      </span>
    </IconButton>
  );
};

export default LanguageSwitcher;

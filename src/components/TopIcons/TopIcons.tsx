import React, { useState, useEffect } from 'react';
import { IconButton, Box, Menu, MenuItem, Typography } from '@mui/material';
import { 
  DarkMode, 
  LightMode,
  Language,
  Chat,
  IosShare
} from '@mui/icons-material';
import LetAiImprovement from '../LetAiImprovement/LetAiImprovement';
import { useT, useLanguage } from '../lenguajes/LanguageContext';
import './TopIcons.css';

interface TopIconsProps {
  isDarkMode?: boolean;
  onDarkModeToggle?: () => void;
}

const TopIcons: React.FC<TopIconsProps> = ({
  isDarkMode = false,
  onDarkModeToggle
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  
  const t = useT();
  const { language, setLanguage } = useLanguage();
  
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsVisible(false);
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DreamWriteShare',
        text: t.common.shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert(t.common.urlCopied);
      }).catch(() => {
        alert(t.common.shareNotAvailable);
      });
    }
  };

  const handleSettings = () => {
    setShowFeedbackDialog(true);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
    handleLanguageClose();
  };

  return (
    <>
      <Box 
        className={`top-icons-container ${!isVisible ? 'hidden' : ''}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>

        <IconButton
          className="top-icon"
          onClick={onDarkModeToggle}
          aria-label={isDarkMode ? t.topIcons.lightMode : t.topIcons.darkMode}
          title={isDarkMode ? t.topIcons.lightMode : t.topIcons.darkMode}
          sx={{
            width: '36px',
            height: '36px',
            '& svg': { fontSize: '20px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        <IconButton
          className="top-icon"
          onClick={handleLanguageClick}
          aria-label={t.topIcons.language}
          title={t.topIcons.language}
          sx={{
            width: '36px',
            height: '36px',
            '& svg': { fontSize: '20px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Language />
        </IconButton>

        <IconButton
          className="top-icon"
          onClick={handleSettings}
          aria-label={t.topIcons.settings}
          title={t.topIcons.settings}
          sx={{
            width: '36px',
            height: '36px',
            '& svg': { 
              fontSize: '20px',
              marginTop: '4px',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Chat />
        </IconButton>

        <IconButton
          className="top-icon"
          onClick={handleShare}
          aria-label={t.topIcons.share}
          title={t.topIcons.share}
          sx={{
            width: '36px',
            height: '36px',
            '& svg': { 
              fontSize: '20px',
              marginBottom: '2px' // Ajuste específico para el ícono de IosShare
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IosShare />
        </IconButton>
      </Box>

      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem 
          onClick={() => handleLanguageChange('en')}
          selected={language === 'en'}
        >
          <Typography>🇺🇸 {t.topIcons.english}</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageChange('es')}
          selected={language === 'es'}
        >
          <Typography>🇪🇸 {t.topIcons.spanish}</Typography>
        </MenuItem>
      </Menu>

      {/* Feedback Dialog */}
      <LetAiImprovement 
        open={showFeedbackDialog} 
        onClose={() => setShowFeedbackDialog(false)} 
      />
    </>
  );
};

export default TopIcons;

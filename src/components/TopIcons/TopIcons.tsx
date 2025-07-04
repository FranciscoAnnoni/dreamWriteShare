import React, { useState, useEffect } from 'react';
import { IconButton, Box } from '@mui/material';
import { 
  DarkMode, 
  LightMode, 
  Share, 
  Settings 
} from '@mui/icons-material';
import LetAiImprovement from '../LetAiImprovement/LetAiImprovement';
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
  
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Hide icons when scrolling
      setIsVisible(false);
      
      // Show icons again after scrolling stops
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
        text: 'Check out this amazing idea sharing app!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('URL copied to clipboard!');
      }).catch(() => {
        alert('Share feature not available');
      });
    }
  };

  const handleSettings = () => {
    setShowFeedbackDialog(true);
  };

  return (
    <>
      <Box className={`top-icons-container ${!isVisible ? 'hidden' : ''}`}>
        {/* Dark/Light Mode Toggle */}
        <IconButton
          className="top-icon"
          onClick={onDarkModeToggle}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Share Icon */}
        <IconButton
          className="top-icon"
          onClick={handleShare}
          aria-label="Share"
          title="Share"
        >
          <Share />
        </IconButton>

        {/* Settings Icon */}
        <IconButton
          className="top-icon"
          onClick={handleSettings}
          aria-label="Settings"
          title="Settings"
        >
          <Settings />
        </IconButton>
      </Box>

      {/* Feedback Dialog */}
      <LetAiImprovement 
        open={showFeedbackDialog} 
        onClose={() => setShowFeedbackDialog(false)} 
      />
    </>
  );
};

export default TopIcons;

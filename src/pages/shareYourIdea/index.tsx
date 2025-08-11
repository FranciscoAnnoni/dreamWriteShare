import React, { useState, useEffect } from 'react';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';
import InputText from '../../base/inputText/inputText';
import Box from '../../base/box/box';
import LittleText from '../../base/littleText/littleText';
import DrawText from './components/drawText';
import Button from '../../base/button/button';
import Celebration from './components/celebration/celebration';
import { AccessTime } from '@mui/icons-material';
import { saveIdea } from '../../firebase/firestore';
import { Alert, Snackbar } from '@mui/material';
import { isValidIdea, getValidationMessage } from './components/validator/ideaValidator';
import { containsBadWords } from '../../utils/badWords';
import { dailySubmissionManager } from './components/localStorage';
import { getCachedUserCountry } from '../../utils/geolocation';
import { useT } from '../../components/lenguajes/LanguageContext';
import './shareYourIdea.css';

interface ShareYourIdeaProps {
  onPageChange?: (page: string) => void;
  onIdeaSubmitted?: () => void;
}

const ShareYourIdea: React.FC<ShareYourIdeaProps> = ({ onPageChange, onIdeaSubmitted }) => {
  const [ideaText, setIdeaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');
  const [canSubmit, setCanSubmit] = useState(true);
  const [userCountry, setUserCountry] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  
  const t = useT();

  useEffect(() => {
    const status = dailySubmissionManager.getSubmissionStatus();
    setCanSubmit(status.canSubmit);
    
    const loadUserCountry = async () => {
      try {
        const country = await getCachedUserCountry();
        setUserCountry(country);
        console.log('🌍 País del usuario:', country);
      } catch (error) {
        console.warn('⚠️ No se pudo obtener el país del usuario:', error);
        setUserCountry('Desconocido');
      }
    };
    
    loadUserCountry();
  }, []);

  const handleSubmitIdea = async () => {
    console.log('🚀 Intentando enviar idea:', ideaText);
    
    const userId = dailySubmissionManager.getCurrentUserId();

    if (!dailySubmissionManager.canSubmitToday()) {
      setAlertMessage(t.shareIdea.validation.alreadySubmitted);
      setAlertType('error');
      setShowAlert(true);
      return;
    }
    
    if (!ideaText.trim()) {
      setAlertMessage(t.shareIdea.validation.emptyIdea);
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    if (ideaText.trim().length < 10) {
      setAlertMessage(t.shareIdea.validation.tooShort);
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    if (!isValidIdea(ideaText)) {
      setAlertMessage(getValidationMessage(ideaText));
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    // Verificar palabras prohibidas
    const hasBadWords = await containsBadWords(ideaText);
    if (hasBadWords) {
      setAlertMessage(t.shareIdea.validation.inappropriateLanguage);
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      console.log('👤 User ID:', userId);
      
      console.log('💾 Guardando idea en Firebase...');
      await saveIdea(ideaText.trim(), userId, userCountry);
      
      dailySubmissionManager.markAsSubmittedToday();
      setCanSubmit(false);
      
      console.log('✅ Idea guardada exitosamente!');
      setIdeaText('');
      
      onIdeaSubmitted?.();
      
      setShowCelebration(true);
      
    } catch (error) {
      console.error('❌ Error enviando la idea:', error);
      setAlertMessage(t.shareIdea.validation.errorSending);
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  const handleNavigateToSeeIdeas = () => {
    if (onPageChange) {
      onPageChange('seeOtherIdeas');
    }
    
    const targetPosition = window.innerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };
  return (
    <div className="share-your-idea share-your-idea-container">
      <Box className="share-your-idea-title-box">
        <div className="share-your-idea-title-scale">
          <TitleWithLogo 
            title={t.shareIdea.title}
            logo={'💡 '}
            logoType="light"
            gap={16}
          />
        </div>
      </Box> 
       
        <LittleText className="share-your-idea-subtitle">
          {t.shareIdea.subtitle}
        </LittleText>

        <div className="share-your-idea-draw-text">
          <DrawText sx={{ 
            position: 'absolute',
            right: '-350px',
            top: '60px',
            transform: 'translateY(-50%)',
            zIndex: 1
          }} />
        </div>

        <div className="share-your-idea-input-scale">
          <InputText 
            placeholder={t.shareIdea.placeholder}
            value={ideaText}
            onChange={setIdeaText}
            disabled={!canSubmit}
          />
        </div>

        <LittleText 
          className="share-your-idea-daily-limit"
          icon={<AccessTime sx={{ fontSize: '1rem', opacity: 0.7 }} />}
          iconPosition="left"
          sx={{
            color: !canSubmit ? '#ff6b6b' : 'inherit'
          }}
        >
          {canSubmit 
            ? t.shareIdea.dailyLimit 
            : t.shareIdea.dailyLimitReached}
        </LittleText>

        <Box className="share-your-idea-button-box">
          <Button 
            variant="primary" 
            size="large"
            onClick={handleSubmitIdea}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? t.shareIdea.sendingButton : canSubmit ? t.shareIdea.sendButton : t.shareIdea.comeBackTomorrow}
          </Button>
        </Box>

        <Snackbar 
          open={showAlert} 
          autoHideDuration={6000} 
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowAlert(false)} 
            severity={alertType}
            sx={{ width: '100%' }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>

        <Celebration 
          show={showCelebration}
          onComplete={handleCelebrationComplete}
          onNavigate={handleNavigateToSeeIdeas}
        />
    </div>
  );
};

export default ShareYourIdea;

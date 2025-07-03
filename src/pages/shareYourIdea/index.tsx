import React, { useState, useEffect } from 'react';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';
import InputText from '../../base/inputText/inputText';
import Box from '../../base/box/box';
import LittleText from '../../base/littleText/littleText';
import DrawText from './components/drawText';
import Button from '../../base/button/button';
import { AccessTime } from '@mui/icons-material';
import { saveIdea } from '../../firebase/firestore';
import { Alert, Snackbar } from '@mui/material';
import { isValidIdea, getValidationMessage } from './components/validator/ideaValidator';
import { dailySubmissionManager } from './components/localStorage';
import { getCachedUserCountry } from '../../utils/geolocation';

const ShareYourIdea: React.FC = () => {
  const [ideaText, setIdeaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');
  const [canSubmit, setCanSubmit] = useState(true);
  const [userCountry, setUserCountry] = useState<string>('');

  // Verificar estado al cargar el componente
  useEffect(() => {
    const status = dailySubmissionManager.getSubmissionStatus();
    setCanSubmit(status.canSubmit);
    
    // Obtener país del usuario
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

    // Verificar si ya envió una idea hoy
    if (!dailySubmissionManager.canSubmitToday()) {
      setAlertMessage('You have already shared an idea today. Come back tomorrow!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }
    
    // Validaciones básicas
    if (!ideaText.trim()) {
      setAlertMessage('Please write your idea before submitting');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    if (ideaText.trim().length < 10) {
      setAlertMessage('Your idea must be at least 10 characters long');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    // Validar que el texto tenga sentido
    if (!isValidIdea(ideaText)) {
      setAlertMessage(getValidationMessage(ideaText));
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      console.log('👤 User ID:', userId);
      
      // Guardar la idea
      console.log('💾 Guardando idea en Firebase...');
      await saveIdea(ideaText.trim(), userId, userCountry);
      
      // Marcar como enviado hoy
      dailySubmissionManager.markAsSubmittedToday();
      setCanSubmit(false);
      
      // Éxito
      console.log('✅ Idea guardada exitosamente!');
      setAlertMessage('Your idea was sent successfully! 🎉 Come back tomorrow for another one.');
      setAlertType('success');
      setShowAlert(true);
      setIdeaText(''); // Limpiar el input
      
    } catch (error) {
      console.error('❌ Error enviando la idea:', error);
      setAlertMessage('There was an error sending your idea. Please try again.');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="share-your-idea" style={{flexDirection: 'column', gap: '2rem', marginTop: '-8rem', position: 'relative'}}>
      <Box sx={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ transform: 'scale(1.1)' }}>
          <TitleWithLogo 
            title="Share your idea"
            logo={'💡 '}
            logoType="light"
            gap={16}
          />
        </div>
      </Box> 
       
        <LittleText sx={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>A simple idea can change everything. </LittleText>

        <DrawText sx={{ 
          position: 'absolute',
          right: '-350px',
          top: '60px',
          transform: 'translateY(-50%)',
          zIndex: 1
        }} />

        <div style={{ transform: 'scale(1.2)' }}>
          <InputText 
            placeholder="¿Y si existiera una app que...?"
            value={ideaText}
            onChange={setIdeaText}
            disabled={!canSubmit}
          />
        </div>

        <LittleText 
          sx={{ 
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: '2rem', 
            fontStyle: 'italic', 
            opacity: 0.8, 
            letterSpacing: '0.5px', 
            fontSize: '0.9rem',
            color: !canSubmit ? '#ff6b6b' : 'inherit'
          }}
          icon={<AccessTime sx={{ fontSize: '1rem', opacity: 0.7 }} />}
          iconPosition="left"
        >
          {canSubmit 
            ? "You can share one idea per day" 
            : "You've shared your idea for today. Come back tomorrow!"}
        </LittleText>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
          <Button 
            variant="primary" 
            size="large"
            onClick={handleSubmitIdea}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? 'Sending...' : canSubmit ? 'Send Idea' : 'Come back tomorrow'}
          </Button>
        </Box>

        {/* Alert/Notification */}
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
    </div>
  );
};

export default ShareYourIdea;

import React from 'react';
import TitleWithLogo from '../../base/titleWithLogo/titleWithLogo';
import InputText from '../../base/inputText/inputText';
import Box from '../../base/box/box';
import LittleText from '../../base/littleText/littleText';
import DrawText from './components/drawText';
import Button from '../../base/button/button';
import { AccessTime } from '@mui/icons-material';

const ShareYourIdea: React.FC = () => {
  return (
    <div className="share-your-idea" style={{flexDirection: 'column', gap: '2rem', marginTop: '-15rem'}}>
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
            fontSize: '0.9rem' 
          }}
          icon={<AccessTime sx={{ fontSize: '1rem', opacity: 0.7 }} />}
          iconPosition="left"
        >
          You can only send one idea per day 
        </LittleText>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
          <Button 
            variant="primary" 
            size="large"
            onClick={() => console.log('Idea enviada!')}
          >
            Enviar Idea
          </Button>
        </Box>
    </div>
  );
};

export default ShareYourIdea;

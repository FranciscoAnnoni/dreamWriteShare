import React from 'react';
import Box from '../../base/box/box';
import TitleWithLogo from '../../base/titleWithLogo/titleWithLogo';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TitleWithLogo 
          title="About Us"
          logo={'ℹ️ '}
          logoType="light"
          gap={16}
        />
      </Box>
      <Box sx={{ textAlign: 'center', maxWidth: '600px' }}>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--color-text-secondary)', 
          lineHeight: 1.6 
        }}>
          We believe that every great innovation starts with a simple idea. 
          Our platform connects dreamers, creators, and innovators from around the world.
        </p>
      </Box>
    </div>
  );
};

export default AboutUs;

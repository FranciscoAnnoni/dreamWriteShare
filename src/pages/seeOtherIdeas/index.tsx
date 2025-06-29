import React from 'react';
import Box from '../../base/box/box';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';

const SeeOtherIdeas: React.FC = () => {
  return (
    <div className="see-other-ideas" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
      marginTop: '-15rem'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TitleWithLogo 
          title="See other ideas"
          logo={'👀 '}
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
          Discover amazing ideas from our community. Get inspired and see what others are creating.
        </p>
      </Box>
    </div>
  );
};

export default SeeOtherIdeas;

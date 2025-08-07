import React from 'react';
import Box from '../../../base/box/box';
import { useMediaQuery } from '@mui/material';

interface DrawTextProps {
  sx?: React.CSSProperties;
}

const DrawText: React.FC<DrawTextProps> = ({ sx = {} }) => {
  const arrowColor = 'var(--color-text-secondary)';
  const isMobile = useMediaQuery('(max-width: 900px)');
  
  if (isMobile) {
    return null;
  }
  
  const textStyles: React.CSSProperties = {
    fontFamily: 'Caveat, cursive, var(--font-family)',
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    lineHeight: 1.2,
    margin: 0,
    marginBottom: '1rem',
    position: 'relative',
    ...sx
  };

  return (
    <Box sx={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
     
    <div style={textStyles}>
      Write your best idea <br />
      to the world
      {/* Flecha SVG posicionada absolutamente */}
      <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 310.4158935546875 188.8628035964071" 
        width="180" 
        height="140"
        style={{ 
          position: 'absolute',
          left: '-90px',
          bottom: '-50px',
          zIndex: 1,
          transform: 'scaleX(-1.1)'
        }}
      >
        <g strokeLinecap="round">
          <g transform="translate(132.30078125 87.90625) rotate(0 71.47301641797185 44.97070434534322)">
            <path d="M-1.04 -0.07 C2.09 9.94, 4.53 45.06, 17.97 60.13 C31.4 75.2, 58.86 86.96, 79.59 90.34 C100.32 93.72, 131.72 82.2, 142.34 80.43" stroke={arrowColor} strokeWidth="5" fill="none" strokeDasharray="8 10"></path>
          </g>
          <g transform="translate(132.30078125 87.90625) rotate(0 71.47301641797185 44.97070434534322)">
            <path d="M121.6 94.39 C126.23 92.67, 131.94 89.49, 142.34 80.43" stroke={arrowColor} strokeWidth="5" fill="none"></path>
          </g>
          <g transform="translate(132.30078125 87.90625) rotate(0 71.47301641797185 44.97070434534322)">
            <path d="M117.47 77.8 C123.05 79.91, 129.71 80.53, 142.34 80.43" stroke={arrowColor} strokeWidth="5" fill="none"></path>
          </g>
        </g>
      </svg>
    </div>
    </Box>
  );
};

export default DrawText;

import React from 'react';
import Box from '../../base/box/box';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';
import { useT } from '../../components/lenguajes/LanguageContext';

const AboutUs: React.FC = () => {
  const t = useT();
  
  return (
    <div className="about-us" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
      marginTop: '-10rem'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TitleWithLogo 
          title={t.aboutUs.title}
          logo={'ℹ️ '}
          logoType="light"
          gap={16}
        />
      </Box>
      <Box sx={{ textAlign: 'center', maxWidth: '700px', padding: '0 16px' }}>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--color-text-primary)', 
          lineHeight: 1.6,
          marginBottom: '1.5rem'
        }}>
          {t.aboutUs.creator.content}
        </p>
        
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--color-text-secondary)', 
          lineHeight: 1.6,
          marginBottom: '1.5rem'
        }}>
          {t.aboutUs.inspiration.content}
        </p>
        
        <a 
          href="https://francisco-annoni.empressaria.com.ar/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          🌐 {t.aboutUs.creator.portfolioButton}
        </a>
      </Box>
    </div>
  );
};

export default AboutUs;

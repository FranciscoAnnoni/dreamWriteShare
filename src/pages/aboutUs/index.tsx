import React from 'react';
import Box from '../../base/box/box';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';
import { useT } from '../../components/lenguajes/LanguageContext';
import './aboutUs.css';

const AboutUs: React.FC = () => {
  const t = useT();
  
  return (
    <div className="about-us-container">
      <Box className="about-us-title-box">
        <TitleWithLogo 
          title={t.aboutUs.title}
          logo={'ℹ️ '}
          logoType="light"
          gap={16}
        />
      </Box>
      <Box className="about-us-content-box">
        <p className="about-us-inspiration-text">
          {t.aboutUs.inspiration.content}
        </p>
        
        <p className="about-us-creator-text">
          {t.aboutUs.creator.content}
        </p>
        
        <Box className="about-us-buttons-box">
          <a 
            href="https://francisco-annoni.empressaria.com.ar/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="about-us-portfolio-link"
          >
            🌐 {t.aboutUs.creator.portfolioButton}
          </a>

          <a 
            href="https://buymeacoffee.com/franciscoannoni" 
            target="_blank" 
            rel="noopener noreferrer"
            className="about-us-donate-link"
          >
            ☕ {t.aboutUs.creator.donateButton}
          </a>
        </Box>
      </Box>
    </div>
  );
};

export default AboutUs;

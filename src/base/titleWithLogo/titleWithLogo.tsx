import React from 'react';
import './titleWithLogo.css';

interface TitleWithLogoProps {
  title: string;
  logo: React.ReactNode | string; // Icono React, string (emoji/texto), o URL de imagen
  className?: string;
  logoType?: 'light' | 'idea' | 'default'; // Para aplicar diferentes hovers
  gap?: number; // Espacio entre logo y título en píxeles
}

const TitleWithLogo: React.FC<TitleWithLogoProps> = ({
  title,
  logo,
  className = '',
  logoType = 'default',
  gap = ''
}) => {
  const renderLogo = () => {
    if (typeof logo === 'string') {
      // Verificar si es una URL de imagen PNG
      if (logo.includes('.png') || logo.includes('http') || logo.includes('/')) {
        return (
          <img 
            src={logo} 
            alt="Logo" 
            className={`logo logo--${logoType}`}
          />
        );
      } else {
        // Si es un string (emoji o texto)
        return (
          <div className={`logo--${logoType}`} style={{ fontSize: '1rem'}}>
            <h1>{logo}</h1>
          </div>
        );
      }
    } else {
      // Si es un componente React (icono)
      return (
        <div className={`logo logo--${logoType}`}>
          {logo}
        </div>
      );
    }
  };

  return (
    <div className={`title-with-logo ${className}`} style={{ gap: `${gap}px` }}>
      {renderLogo()}
      <h1 className="title-with-logo__title">
        {title}
      </h1>
    </div>
  );
};

export default TitleWithLogo;

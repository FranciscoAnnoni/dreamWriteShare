import React from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import './card.css';

interface CardProps {
  description: string;
  rating?: number;
  location?: string;
  date?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  description,
  rating = 0,
  location,
  date,
  sx,
  onClick,
  children
}) => {
  const truncatedDescription = description.length > 250 
    ? description.substring(0, 250) + '...' 
    : description;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star star-full">⭐</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star star-half">⭐</span>);
      } else {
        stars.push(<span key={i} className="star star-empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <Box 
      className={`card ${onClick ? 'card-clickable' : ''}`}
      sx={sx}
      onClick={onClick}
    >
      <div className="card-content">
        {/* Descripción truncada */}
        <p className="card-description">{truncatedDescription}</p>
        
        {/* Footer con rating a la izquierda y location a la derecha */}
        <div className="card-footer">
          <div className="card-rating">
            {rating > 0 && renderStars(rating)}
          </div>
          <div className="card-location-container">
            {location && (
              <span className="card-location">{location}</span>
            )}
          </div>
        </div>
        
        {/* Contenido personalizado */}
        {children}
      </div>
    </Box>
  );
};

export default Card;

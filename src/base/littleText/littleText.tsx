import React from 'react';
import './littleText.css';

interface LittleTextProps {
  children: React.ReactNode;
  className?: string;
  sx?: React.CSSProperties;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const LittleText: React.FC<LittleTextProps> = ({ 
  children, 
  className = '', 
  sx, 
  icon, 
  iconPosition = 'left' 
}) => {
  return (
    <span 
      className={`little-text ${className}`}
      style={{ 
        ...sx, 
        display: 'flex', 
        alignItems: 'center',
        gap: icon ? '0.5rem' : '0'
      }}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </span>
  );
};

export default LittleText;

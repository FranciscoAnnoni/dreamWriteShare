import React from 'react';
import './cleanButton.css';

interface CleanButtonProps {
  children?: React.ReactNode;
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  sx?: React.CSSProperties;
}

const CleanButton: React.FC<CleanButtonProps> = ({ 
  children,
  text,
  icon,
  iconPosition = 'left',
  onClick, 
  disabled = false, 
  size = 'medium',
  className = '',
  sx = {}
}) => {
  const buttonClass = `clean-button clean-button--${size} ${className} ${disabled ? 'disabled' : ''}`;

  const renderContent = () => {
    // Si se proporcionan children, úsalos directamente
    if (children) {
      return children;
    }

    // Si no hay children, construir el contenido con text e icon
    const textElement = text && <span className="clean-button__text">{text}</span>;
    const iconElement = icon && <span className="clean-button__icon">{icon}</span>;

    if (iconPosition === 'left') {
      return (
        <>
          {iconElement}
          {textElement}
        </>
      );
    } else {
      return (
        <>
          {textElement}
          {iconElement}
        </>
      );
    }
  };

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      style={sx}
      type="button"
    >
      {renderContent()}
    </button>
  );
};

export default CleanButton;

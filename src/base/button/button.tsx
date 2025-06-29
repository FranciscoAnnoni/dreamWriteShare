import React from 'react';
import './button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  sx?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  className = '',
  sx = {}
}) => {
  const buttonClass = `custom-button custom-button--${variant} custom-button--${size} ${className}`;

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      style={sx}
    >
      <span className="button-content">
        {children}
        <span className="button-arrow">→</span>
      </span>
    </button>
  );
};

export default Button;

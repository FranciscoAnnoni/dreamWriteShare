import React from 'react';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'orange' | 'yellow';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  color = 'orange', 
  text = 'Cargando...', 
  className = '' 
}) => {
  const sizeClass = size === 'medium' ? '' : size;
  const colorClass = color === 'yellow' ? 'yellow' : '';
  const containerClass = size === 'small' ? 'compact' : '';
  const noTextClass = !text ? 'no-text' : '';
  
  return (
    <div className={`loading-container ${containerClass} ${noTextClass} ${className}`}>
      <div className="loading-content">
        <div className={`loading-ring ${sizeClass} ${colorClass}`}></div>
        {text && <div className="loading-text">{text}</div>}
      </div>
    </div>
  );
};

export default Loading;

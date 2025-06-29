import React, { useState, useRef, useEffect } from 'react';
import './inputText.css';

interface InputTextProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  maxLength?: number;
}

const InputText: React.FC<InputTextProps> = ({
  placeholder = "¿Y si existiera una app que...?",
  value,
  onChange,
  className = '',
  maxLength = 600
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value, internalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Limitar la cantidad de caracteres
    if (newValue.length <= maxLength) {
      setInternalValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
      adjustHeight();
    }
  };

  const currentValue = value !== undefined ? value : internalValue;
  
  // Determinar la clase CSS del contador según el porcentaje usado
  const usedPercentage = (currentValue.length / maxLength) * 100;
  let counterClass = 'character-counter';
  if (usedPercentage >= 90) {
    counterClass += ' danger';
  } else if (usedPercentage >= 75) {
    counterClass += ' warning';
  }

  return (
    <div className={`input-text-card ${className}`}>
      <textarea
        ref={textareaRef}
        className="input-text-field"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        rows={1}
        maxLength={maxLength}
      />
      <div className={counterClass}>
        {currentValue.length}/{maxLength} caracteres
      </div>
    </div>
  );
};

export default InputText;

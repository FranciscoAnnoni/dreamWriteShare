import React, { useEffect, useState } from 'react';
import './celebration.css';

interface CelebrationProps {
  show: boolean;
  isBackendComplete?: boolean;
  onComplete?: () => void;
  onNavigate?: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({ show, isBackendComplete = false, onComplete, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      playHornSound();
    }
  }, [show]);

  // Efecto separado para manejar cuando el backend complete
  useEffect(() => {
    if (show && isBackendComplete) {
      // Esperar un momento mínimo para que la celebración sea visible
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
        
        setTimeout(() => {
          onNavigate?.();
        }, 500);
      }, 2000); // Reducido a 2 segundos ya que la celebración ya está mostrándose

      return () => clearTimeout(timer);
    }
  }, [show, isBackendComplete, onComplete, onNavigate]);

  const playHornSound = () => {
    try {
      // Crear el sonido de corneta usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Crear una serie de tonos para simular una corneta
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'triangle';
        
        // Configurar el volumen y la duración
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + index * 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.2 + 0.4);
        
        oscillator.start(audioContext.currentTime + index * 0.2);
        oscillator.stop(audioContext.currentTime + index * 0.2 + 0.4);
      });
    } catch (error) {
      console.warn('No se pudo reproducir el sonido de celebración:', error);
    }
  };

  const generateConfetti = () => {
    const confettiPieces = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    
    for (let i = 0; i < 100; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      const animationDuration = 3 + Math.random() * 2;
      
      confettiPieces.push(
        <div
          key={i}
          className="confetti-piece"
          style={{
            backgroundColor: color,
            left: `${left}%`,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`,
          }}
        />
      );
    }
    
    return confettiPieces;
  };

  if (!isVisible) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-container">
        {/* Papel picado */}
        <div className="confetti-container">
          {generateConfetti()}
        </div>
        
        {/* Mensaje de celebración */}
        <div className="celebration-message">
          <div className="celebration-icon">🎉</div>
          <h2>¡Idea Enviada!</h2>
          <p>Tu idea ha sido compartida con éxito</p>
          <div className="celebration-subtext">
            Redirigiendo a ver otras ideas...
          </div>
        </div>
        
        {/* Efectos adicionales */}
        <div className="celebration-sparkles">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">⭐</div>
          <div className="sparkle sparkle-3">💫</div>
          <div className="sparkle sparkle-4">🌟</div>
        </div>
      </div>
    </div>
  );
};

export default Celebration;

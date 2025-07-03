import React from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import type { Idea } from '../../../firebase/firestore';

interface IdeaDialogProps {
  idea: Idea | null;
  open: boolean;
  onClose: () => void;
  rating?: number;
  location?: string;
  date?: string;
}

const IdeaDialog: React.FC<IdeaDialogProps> = ({
  idea,
  open,
  onClose,
  rating = 0,
  location = '',
  date = ''
}) => {
  if (!idea) return null;

  // Renderizar estrellas
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#FFD700', fontSize: '1.2rem' }}>⭐</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#FFD700', fontSize: '1.2rem' }}>⭐</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#E0E0E0', fontSize: '1.2rem' }}>☆</span>);
      }
    }
    
    return stars;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box
        sx={{
          bgcolor: 'var(--color-background)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          p: 0,
          width: '700px',
          maxHeight: '80vh',
          overflow: 'hidden',
          position: 'relative',
          outline: 'none'
        }}
      >

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            pb: 2,
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)'
          }}>
            💡 Idea Detail
          </h2>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'var(--color-text-secondary)',
              '&:hover': {
                backgroundColor: 'var(--color-hover)',
                color: 'var(--color-text-primary)'
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(80vh - 100px)' }}>
          <Box sx={{ mb: 3 }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)'
            }}>
              📝 Descripción
            </h3>
            <div style={{
              margin: 0,
              fontSize: '1rem',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-hover)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              height: 'auto',
              minHeight: '200px',
              boxSizing: 'border-box',
              wordWrap: 'break-word',
              overflow: 'hidden'
            }}>
              {idea.idea}
            </div>
          </Box>

          <Box sx={{ mb: 3 }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)'
            }}>
              ⭐ Valoración
            </h3>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {renderStars(rating)}
              <span style={{
                marginLeft: '8px',
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)'
              }}>
                ({rating}/5)
              </span>
            </Box>
          </Box>

          {/* Información adicional */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 3,
            mt: 2
          }}>
            {/* Ubicación */}
            <Box>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)'
              }}>
                🌍 Ubicación
              </h3>
              <p style={{
                margin: 0,
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                padding: '12px',
                backgroundColor: 'var(--color-hover)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)'
              }}>
                {location || 'No especificada'}
              </p>
            </Box>

            {/* Fecha */}
            <Box>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)'
              }}>
                📅 Fecha
              </h3>
              <p style={{
                margin: 0,
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                padding: '12px',
                backgroundColor: 'var(--color-hover)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)'
              }}>
                {date || 'No especificada'}
              </p>
            </Box>
          </Box>

          {/* Puntos (si están disponibles) */}
          <Box sx={{ mt: 3 }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)'
            }}>
              🎯 Visualizations
            </h3>
            <p style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--color-primary)',
              padding: '12px',
              backgroundColor: 'var(--color-hover)',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}>
              {idea.points || 0} puntos
            </p>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default IdeaDialog;
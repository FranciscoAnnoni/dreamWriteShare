import React, { useState, useEffect } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import { Close, Star } from '@mui/icons-material';
import CleanButton from '../../../base/cleanButton';
import Loading from '../../../components/Loading';
import { hasUserVotedIdea, voteIdea, getUserVoteForIdea, type Idea, type IdeaVote } from '../../../firebase/firestore';
import { getUserCountry } from '../../../utils/geolocation';

interface IdeaDialogProps {
  idea: Idea | null;
  open: boolean;
  onClose: () => void;
  location?: string;
  date?: string;
  onVoteSubmitted?: () => void;
}

const IdeaDialog: React.FC<IdeaDialogProps> = ({
  idea,
  open,
  onClose,
  location = '',
  date = '',
  onVoteSubmitted
}) => {
  const [userVote, setUserVote] = useState<IdeaVote | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Generar userId consistente (en producción usar autenticación real)
  const getUserId = () => {
    let userId = localStorage.getItem('dreamWriteShare_userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('dreamWriteShare_userId', userId);
    }
    return userId;
  };

  useEffect(() => {
    if (open && idea?.id) {
      checkUserVote();
    }
  }, [open, idea?.id]);

  const checkUserVote = async () => {
    if (!idea?.id) return;
    
    try {
      const userId = getUserId();
      const voted = await hasUserVotedIdea(idea.id, userId);
      setHasVoted(voted);
      
      if (voted) {
        const vote = await getUserVoteForIdea(idea.id, userId);
        setUserVote(vote);
      } else {
        setUserVote(null);
      }
    } catch (error) {
      console.error('Error verificando voto del usuario:', error);
    }
  };

  if (!idea) return null;

  const handleStarHover = (starValue: number) => {
    if (!hasVoted) {
      setHoveredStar(starValue);
    }
  };

  const handleStarLeave = () => {
    if (!hasVoted) {
      setHoveredStar(0);
    }
  };

  const handleStarClick = (starValue: number) => {
    if (!hasVoted) {
      setSelectedStars(starValue);
    }
  };

  const handleSubmitVote = async () => {
    if (!idea?.id || selectedStars === 0 || hasVoted) return;

    setSubmitting(true);
    try {
      const userId = getUserId();
      const userCountry = await getUserCountry();
      
      await voteIdea(idea.id, selectedStars, userId, userCountry);
      
      setHasVoted(true);
      setSelectedStars(0);
      setHoveredStar(0);
      
      await checkUserVote();
      
      onVoteSubmitted?.();
      
      console.log('Voto enviado exitosamente');
    } catch (error) {
      console.error('Error enviando voto:', error);
      alert('Error al enviar el voto. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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

  const renderVoteStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isHovered = hoveredStar >= i;
      const isSelected = selectedStars >= i;
      const shouldShow = isHovered || isSelected;
      
      stars.push(
        <span
          key={i}
          style={{
            fontSize: '1.2rem',
            cursor: hasVoted ? 'default' : 'pointer',
            color: shouldShow ? '#FFD700' : '#E0E0E0',
            transition: 'color 0.2s ease',
            userSelect: 'none'
          }}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        >
          {shouldShow ? '⭐' : '☆'}
        </span>
      );
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

          {/* Sección en paralelo: Valoración y Votación */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 3,
            mb: 3
          }}>
            {/* Valoración actual (izquierda) */}
            <Box>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)'
              }}>
                📊 Valoración Actual
              </h3>
              <Box sx={{ 
                padding: '16px',
                backgroundColor: 'var(--color-hover)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                height: '100px',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
                  {renderStars(idea.averageStars || 0)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)'
                  }}>
                    {idea.averageStars ? idea.averageStars.toFixed(1) : '0'}/5
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>•</span>
                    <span>{idea.totalVotes || 0} voto{(idea.totalVotes || 0) !== 1 ? 's' : ''}</span>
                  </div>
                </Box>
              </Box>
            </Box>

            {/* Votación (derecha) */}
            <Box>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)'
              }}>
                {hasVoted ? '✅ Tu Voto' : '🌟 Votar Esta Idea'}
              </h3>
              
              <Box sx={{ 
                padding: '16px',
                backgroundColor: 'var(--color-hover)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                height: '100px',
              }}>
                {hasVoted ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <span style={{ fontSize: '1.2rem', color: '#FFD700' }}>
                        {'⭐'.repeat(userVote?.stars || 0)}
                        {'☆'.repeat(5 - (userVote?.stars || 0))}
                      </span>
                    </Box>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)',
                      margin: '8px 0'
                    }}>
                      Votaste {userVote?.stars || 0} estrella{(userVote?.stars || 0) !== 1 ? 's' : ''}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-secondary)'
                    }}>
                      ¡Gracias por tu voto!
                    </div>
                  </>
                ) : (
                  <>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center', 
                        gap: 0.5,
                        mb: 2
                      }}
                      onMouseLeave={handleStarLeave}
                    >
                      {renderVoteStars()}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                      {submitting ? (
                        <Loading size="small" color="orange" text="Enviando..." />
                      ) : (
                        <>
                          <CleanButton
                            text="Votar"
                            icon={<Star />}
                            iconPosition="left"
                            onClick={handleSubmitVote}
                            size="small"
                            disabled={selectedStars === 0}
                            sx={{ 
                              fontSize: '0.8rem',
                              padding: '6px 12px'
                            }}
                          />
                          <CleanButton
                            text="✕"
                            onClick={() => {
                              setSelectedStars(0);
                              setHoveredStar(0);
                            }}
                            size="small"
                            disabled={selectedStars === 0}
                            sx={{ 
                              fontSize: '0.8rem',
                              padding: '6px 8px',
                              minWidth: 'auto'
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </>
                )}
              </Box>
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
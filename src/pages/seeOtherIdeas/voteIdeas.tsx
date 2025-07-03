import React, { useState } from 'react';
import { Box, Modal, IconButton, CircularProgress } from '@mui/material';
import { Close, Star } from '@mui/icons-material';
import CleanButton from '../../base/cleanButton';
import { getRandomIdeaWithoutStars, updateIdeaStars, type Idea } from '../../firebase/firestore';

interface VoteIdeasProps {
  open: boolean;
  onClose: () => void;
  onVoteSubmitted?: () => void;
}

const VoteIdeas: React.FC<VoteIdeasProps> = ({
  open,
  onClose,
  onVoteSubmitted
}) => {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Cargar idea aleatoria cuando se abre el modal
  React.useEffect(() => {
    if (open) {
      loadRandomIdea();
      setRating(0);
      setHoveredStar(0);
    }
  }, [open]);

  const loadRandomIdea = async () => {
    setLoading(true);
    try {
      const randomIdea = await getRandomIdeaWithoutStars();
      setIdea(randomIdea);
    } catch (error) {
      console.error('Error cargando idea aleatoria:', error);
      setIdea(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmitVote = async () => {
    if (!idea || !idea.id || rating === 0) return;

    setSubmitting(true);
    try {
      await updateIdeaStars(idea.id, rating);
      onVoteSubmitted?.();
      onClose();
    } catch (error) {
      console.error('Error enviando voto:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isHovered = hoveredStar >= i;
      const isSelected = rating >= i;
      const shouldShow = isHovered || isSelected;
      
      stars.push(
        <span
          key={i}
          style={{
            fontSize: '2rem',
            cursor: 'pointer',
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Not specified';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Not specified';
    }
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
        {/* Header */}
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
            ⭐ Vote for Idea
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

        {/* Content */}
        <Box sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(80vh - 160px)' }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '300px' 
            }}>
              <CircularProgress />
            </Box>
          ) : !idea ? (
            <Box sx={{ 
              textAlign: 'center', 
              minHeight: '300px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}>
              <p style={{
                fontSize: '1.2rem',
                color: 'var(--color-text-secondary)',
                margin: '0 0 20px 0'
              }}>
                🎉 No more ideas to vote for now!
              </p>
              <p style={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                margin: 0
              }}>
                All available ideas have already been voted on.
              </p>
            </Box>
          ) : (
            <>
              {/* Descripción de la idea */}
              <Box sx={{ mb: 3 }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)'
                }}>
                  💡 Idea to vote on
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
                  minHeight: '150px',
                  boxSizing: 'border-box',
                  wordWrap: 'break-word',
                  overflow: 'hidden'
                }}>
                  {idea.idea}
                </div>
              </Box>

              {/* Información adicional */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 3,
                mb: 3
              }}>
                {/* Ubicación */}
                <Box>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)'
                  }}>
                    🌍 Country
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
                    {idea.country || 'Not specified'}
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
                    📅 Date
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
                    {formatDate(idea.createdAt)}
                  </p>
                </Box>
              </Box>

              {/* Sistema de votación */}
              <Box sx={{ mb: 3 }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)'
                }}>
                  ⭐ Your rating
                </h3>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 2
                }}>
                  {renderStars()}
                </Box>
                <p style={{
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  Click on the stars to vote (1-5 stars)
                </p>
              </Box>
            </>
          )}
        </Box>

        {/* Footer con botones */}
        {idea && (
          <Box sx={{ 
            p: 3, 
            pt: 2, 
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <CleanButton
              text="Cancel"
              onClick={onClose}
              size="medium"
              className="clean-button--cancel"
            />
            
            <CleanButton
              text={submitting ? 'Sending...' : 'Vote'}
              icon={submitting ? <CircularProgress size={16} /> : <Star />}
              iconPosition="left"
              onClick={handleSubmitVote}
              disabled={rating === 0 || submitting}
              size="medium"
              className={rating > 0 && !submitting ? 'clean-button--vote-active' : 'clean-button--vote-inactive'}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default VoteIdeas;

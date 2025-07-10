import React, { useState } from 'react';
import { Box, Modal, IconButton, TextField } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import CleanButton from '../../base/cleanButton/cleanButton';
import Loading from '../Loading/Loading';
import { submitUserFeedback } from '../../firebase/firestore';

interface LetAiImprovementProps {
  open: boolean;
  onClose: () => void;
}

const LetAiImprovement: React.FC<LetAiImprovementProps> = ({ open, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      // Enviar feedback a Firebase
      await submitUserFeedback(feedback);
      
      setSubmitted(true);
      setTimeout(() => {
        setFeedback('');
        setSubmitted(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error enviando feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFeedback('');
      setSubmitted(false);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          width: '500px',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <h2 style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
            }}>
                Help Us Improve
            </h2>
        </Box>
          <IconButton
            onClick={handleClose}
            disabled={submitting}
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
        <Box sx={{ p: 3 }}>
          {submitted ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ fontSize: '3rem', mb: 2 }}>🎉</Box>
              <h3 style={{
                margin: '0 0 8px 0',
                color: 'var(--color-text-primary)',
                fontSize: '1.2rem'
              }}>
                Thank you for your feedback!
              </h3>
              <p style={{
                margin: 0,
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem'
              }}>
                Your suggestions help us make the app better for everyone.
              </p>
            </Box>
          ) : (
            <>
              <p style={{
                margin: '0 0 16px 0',
                color: 'var(--color-text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}>
                We'd love to hear your thoughts! Share any suggestions, issues, 
                or ideas to help us improve the app experience.
              </p>

              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="Tell us what you think... (e.g., new features, improvements, bugs)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={submitting}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--color-hover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--color-primary)',
                      },
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--color-primary)',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    '&::placeholder': {
                      color: 'var(--color-text-secondary)',
                      opacity: 0.7,
                    },
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <CleanButton
                  text="Cancel"
                  onClick={handleClose}
                  size="small"
                  disabled={submitting}
                />
                
                {submitting ? (
                  <Loading size="small" color="orange" text="Sending..." />
                ) : (
                  <CleanButton
                    text="Send Feedback"
                    icon={<Send sx={{ fontSize: '1rem' }} />}
                    iconPosition="right"
                    onClick={handleSubmit}
                    size="small"
                    disabled={!feedback.trim()}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default LetAiImprovement;

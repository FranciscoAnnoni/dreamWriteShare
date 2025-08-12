import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import LazyCard from './LazyCard';
import IdeaDialog from '../../pages/seeOtherIdeas/components/ideaDialog';
import type { Idea } from '../../firebase/firestore';
import './LazyCards.css';

interface LazyCardsProps {
  ideas: Idea[];
  loading?: boolean;
  onVoteSubmitted?: () => void;
}

const LazyCards: React.FC<LazyCardsProps> = ({ ideas, loading = false, onVoteSubmitted }) => {
  const countries = ['España', 'México', 'Argentina', 'Chile', 'Colombia', 'Perú', 'Estados Unidos', 'Francia', 'Italia', 'Alemania'];
  
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const CARD_HEIGHT = 138;
  const CARDS_VISIBLE = 4;
  const CONTAINER_HEIGHT = CARD_HEIGHT * CARDS_VISIBLE + 24;
  const BUFFER_SIZE = 2;
  
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / CARD_HEIGHT) - BUFFER_SIZE);
  const endIndex = Math.min(
    ideas.length - 1,
    Math.floor((scrollTop + CONTAINER_HEIGHT) / CARD_HEIGHT) + BUFFER_SIZE
  );
  
  const visibleItems = ideas.slice(startIndex, endIndex + 1);
  
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };
  
  const getIdeaRating = (idea: Idea) => {
    return idea.averageStars || 0;
  };
  
  const getConsistentCountry = (idea: Idea): string => {
    if (idea.country && idea.country !== 'Desconocido') {
      return idea.country;
    }
    
    const ideaId = idea.id || '0';
    const hash = ideaId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return countries[Math.abs(hash) % countries.length];
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Hace tiempo';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedIdea(null);
  };

  if (loading) {
    return (
      <Box className="lazy-cards-loading-container">
        <p className="lazy-cards-loading-text">Cargando ideas...</p>
      </Box>
    );
  }

  if (ideas.length === 0) {
    return (
      <Box className="lazy-cards-empty-container">
        <p className="lazy-cards-empty-text">No hay ideas para mostrar</p>
      </Box>
    );
  }

  return (
    <Box className="lazy-cards-main-container">
      <Box
        className={`lazy-cards-external-container ${ideas.length >= 5 ? 'lazy-cards-external-container--with-gap' : ''}`}
        style={{ height: `${CONTAINER_HEIGHT}px` }}
      >
        <Box
          className={`lazy-cards-content-container ${ideas.length >= 5 ? '' : 'lazy-cards-content-container--full-width'}`}
        >
          <Box
            ref={containerRef}
            onScroll={handleScroll}
            className="lazy-cards-scrollable-container"
          >
            <Box
              className="lazy-cards-virtual-container"
              style={{ height: `${ideas.length * CARD_HEIGHT}px` }}
            >
              <Box
                className="lazy-cards-visible-items-container"
                style={{ top: `${startIndex * CARD_HEIGHT}px` }}
              >
                {visibleItems.map((idea, relativeIndex) => {
                  const actualIndex = startIndex + relativeIndex;
                  return (
                    <LazyCard
                      key={idea.id || actualIndex}
                      idea={idea}
                      rating={getIdeaRating(idea)}
                      location={getConsistentCountry(idea)}
                      date={formatDate(idea.createdAt)}
                      onClick={() => handleIdeaClick(idea)}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {ideas.length >= 5 && (
          <Box className="lazy-cards-custom-scrollbar">
            <Box
              className="lazy-cards-scrollbar-thumb"
              style={{
                top: `${ideas.length > 3 ? (scrollTop / (ideas.length * CARD_HEIGHT - CONTAINER_HEIGHT)) * (CONTAINER_HEIGHT - (CONTAINER_HEIGHT * CONTAINER_HEIGHT) / (ideas.length * CARD_HEIGHT) - 15 ) : 0 }px`,
                height: `${ideas.length > 3 ? Math.max(20, (CONTAINER_HEIGHT * CONTAINER_HEIGHT) / (ideas.length * CARD_HEIGHT)) : 20}px`,
              }}
            />
          </Box>
        )}
      </Box>

      <IdeaDialog
        idea={selectedIdea}
        open={dialogOpen}
        onClose={handleCloseDialog}
        location={selectedIdea ? getConsistentCountry(selectedIdea) : ''}
        date={selectedIdea ? formatDate(selectedIdea.createdAt) : ''}
        onVoteSubmitted={onVoteSubmitted}
      />
    </Box>
  );
};

export default LazyCards;

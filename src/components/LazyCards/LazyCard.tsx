import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Box } from '@mui/material';
import Card from '../../base/card/card';
import type { Idea } from '../../firebase/firestore';

interface LazyCardProps {
  idea: Idea;
  rating: number;
  location: string;
  date: string;
  onClick?: () => void;
}

const LazyCard: React.FC<LazyCardProps> = ({ idea, rating, location, date, onClick }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Cambiado a false para mejor control
    threshold: 0.1,
    rootMargin: '50px',
  });

  const cardStyles = {
    transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
    opacity: inView ? 1 : 0.3,
    transform: inView ? 'scale(1)' : 'scale(0.98)',
    marginBottom: '8px',
    width: '650px',
    height: '130px',
    flexShrink: 0,
  };

  return (
    <Box ref={ref} sx={cardStyles}>
      <Card
        description={idea.idea}
        rating={rating}
        location={location}
        date={date}
        onClick={onClick}
      />
    </Box>
  );
};

export default LazyCard;

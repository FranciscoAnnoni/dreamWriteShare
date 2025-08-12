import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Box } from '@mui/material';
import Card from '../../base/card/card';
import type { Idea } from '../../firebase/firestore';
import './LazyCards.css';

interface LazyCardProps {
  idea: Idea;
  rating: number;
  location: string;
  date: string;
  onClick?: () => void;
}

const LazyCard: React.FC<LazyCardProps> = ({ idea, rating, location, date, onClick }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <Box 
      ref={ref} 
      className={`lazy-card-wrapper ${inView ? 'lazy-card-wrapper--visible' : 'lazy-card-wrapper--hidden'}`}
    >
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

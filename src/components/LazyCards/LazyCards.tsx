import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import LazyCard from './LazyCard';
import type { Idea } from '../../firebase/firestore';

interface LazyCardsProps {
  ideas: Idea[];
  loading?: boolean;
}

const LazyCards: React.FC<LazyCardsProps> = ({ ideas, loading = false }) => {
  // Array de países aleatorios para las ideas
  const countries = ['España', 'México', 'Argentina', 'Chile', 'Colombia', 'Perú', 'Estados Unidos', 'Francia', 'Italia', 'Alemania'];
  
  // Configuración del scroll virtual
  const CARD_HEIGHT = 138; // Altura de cada card + margin (130 + 8)
  const CARDS_VISIBLE = 4; // Número de cards visibles
  const CONTAINER_HEIGHT = CARD_HEIGHT * CARDS_VISIBLE +10; // Altura del contenedor
  const BUFFER_SIZE = 2; // Renderizar 2 items extra arriba y abajo para smooth scroll
  
  // Estados para la virtualización
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calcular qué items están visibles
  const startIndex = Math.max(0, Math.floor(scrollTop / CARD_HEIGHT) - BUFFER_SIZE);
  const endIndex = Math.min(
    ideas.length - 1,
    Math.floor((scrollTop + CONTAINER_HEIGHT) / CARD_HEIGHT) + BUFFER_SIZE
  );
  
  // Items visibles que realmente se van a renderizar
  const visibleItems = ideas.slice(startIndex, endIndex + 1);
  
  // Manejar el scroll
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };
  
  // Función para generar rating aleatorio pero consistente por idea
  const getConsistentRating = (ideaId: string) => {
    // Usar el ID de la idea para generar un número consistente
    const hash = ideaId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 5) + 1;
  };
  
  // Función para obtener país consistente por idea
  const getConsistentCountry = (ideaId: string) => {
    const hash = ideaId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return countries[Math.abs(hash) % countries.length];
  };

  // Función para formatear la fecha
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

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Cargando ideas...</p>
      </Box>
    );
  }

  if (ideas.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>No hay ideas para mostrar</p>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}>
      {/* Contenedor externo con scroll */}
      <Box
        sx={{
          height: `${CONTAINER_HEIGHT}px`,
          width: '620px', // Un poco más ancho para acomodar el scroll externo
          position: 'relative',
          display: 'flex',
          gap: '8px', // Espacio entre el contenido y el scroll
        }}
      >
        {/* Contenedor de contenido sin scroll */}
        <Box
          sx={{
            width: '600px',
            height: '100%',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            backgroundColor: 'var(--color-background)',
            //boxShadow: '0 0.1px 2px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden', // Ocultar cualquier overflow
            position: 'relative',
          }}
        >
          {/* Contenedor scrolleable invisible */}
          <Box
            ref={containerRef}
            onScroll={handleScroll}
            sx={{
              height: '100%',
              width: 'calc(100% + 20px)', // Extender para ocultar el scrollbar nativo
              overflowY: 'auto',
              overflowX: 'hidden',
              position: 'relative',
            }}
          >
            {/* Contenedor virtual - representa el espacio total de todos los items */}
            <Box
              sx={{
                height: `${ideas.length * CARD_HEIGHT}px`,
                position: 'relative',
                paddingRight: '20px', // Compensar el margin negativo
              }}
            >
              {/* Contenedor para los items visibles */}
              <Box
                sx={{
                  position: 'absolute',
                  top: `${startIndex * CARD_HEIGHT}px`,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: '25px', // Espacio para el scroll externo
                  marginLeft: '-9px', // Ocultar el scrollbar nativo
                }}
              >
                {visibleItems.map((idea, relativeIndex) => {
                  const actualIndex = startIndex + relativeIndex;
                  return (
                    <LazyCard
                      key={idea.id || actualIndex}
                      idea={idea}
                      rating={getConsistentRating(idea.id || actualIndex.toString())}
                      location={getConsistentCountry(idea.id || actualIndex.toString())}
                      date={formatDate(idea.createdAt)}
                      onClick={() => console.log('Idea clicked:', idea.id)}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Scrollbar personalizada externa */}
        <Box
          sx={{
            width: '4px', // Más fino
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '2px',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          {/* Thumb del scroll */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'var(--color-border)',
              borderRadius: '2px',
              position: 'absolute',
              top: `${ideas.length > 0 ? (scrollTop / (ideas.length * CARD_HEIGHT - CONTAINER_HEIGHT)) * (CONTAINER_HEIGHT - (CONTAINER_HEIGHT * CONTAINER_HEIGHT) / (ideas.length * CARD_HEIGHT)) : 0}px`,
              height: `${ideas.length > 0 ? Math.max(20, (CONTAINER_HEIGHT * CONTAINER_HEIGHT) / (ideas.length * CARD_HEIGHT)) : 20}px`,
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'var(--color-text-secondary)',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LazyCards;

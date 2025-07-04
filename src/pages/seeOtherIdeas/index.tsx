import React, { useState, useEffect } from 'react';
import Box from '../../base/box/box';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';
import LazyCards from '../../components/LazyCards/LazyCards';
import Loading from '../../components/Loading/Loading';
import SelectDropdown, { type SelectOption } from '../../base/selectDropdown/selectDropdown';
import CleanButton from '../../base/cleanButton/cleanButton';
import VoteIdeas from './voteIdeas';
import { getIdeasWithStars, type Idea } from '../../firebase/firestore';
import { Star } from '@mui/icons-material';

const SeeOtherIdeas: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [originalIdeas, setOriginalIdeas] = useState<Idea[]>([]); // Para almacenar las ideas originales
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('stars');
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [hasIdeasWithStars, setHasIdeasWithStars] = useState(true);

  // Opciones del dropdown para ordenar
  const sortOptions: SelectOption[] = [
    { value: 'stars', label: '⭐ Ordenar por estrellas' },
    { value: 'date', label: '📅 Ordenar por fecha' },
    { value: 'views', label: '👁️ Ordenar por vistas' }
  ];

  // Función para ordenar ideas en el frontend
  const sortIdeas = (ideas: Idea[], sortBy: string): Idea[] => {
    switch (sortBy) {
      case 'stars':
        return [...ideas].sort((a, b) => (b.averageStars || 0) - (a.averageStars || 0));
      case 'date':
        return [...ideas].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      case 'views':
        return [...ideas].sort((a, b) => (b.views || 0) - (a.views || 0));
      default:
        return ideas;
    }
  };

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        console.log('🔄 Cargando ideas con votos desde Firebase...');
        const ideasFromFirebase = await getIdeasWithStars(20); // Obtener las últimas 20 ideas con votos
        setOriginalIdeas(ideasFromFirebase); // Guardar las ideas originales
        setIdeas(sortIdeas(ideasFromFirebase, sortBy)); // Aplicar ordenamiento inicial
        setHasIdeasWithStars(ideasFromFirebase.length > 0);
        console.log('✅ Ideas con votos cargadas:', ideasFromFirebase.length);
      } catch (error) {
        console.error('❌ Error cargando ideas con votos:', error);
        setHasIdeasWithStars(false);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

  // useEffect para manejar el cambio de ordenamiento
  useEffect(() => {
    if (originalIdeas.length > 0) {
      console.log('🔄 Aplicando ordenamiento:', sortBy);
      const sortedIdeas = sortIdeas(originalIdeas, sortBy);
      setIdeas(sortedIdeas);
    }
  }, [sortBy, originalIdeas]);

  // Función para recargar las ideas después de votar
  const reloadIdeas = async () => {
    setLoading(true);
    try {
      console.log('🔄 Recargando ideas después de votar...');
      const ideasFromFirebase = await getIdeasWithStars(20);
      setOriginalIdeas(ideasFromFirebase);
      setIdeas(sortIdeas(ideasFromFirebase, sortBy));
      setHasIdeasWithStars(ideasFromFirebase.length > 0);
      console.log('✅ Ideas recargadas:', ideasFromFirebase.length);
    } catch (error) {
      console.error('❌ Error recargando ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="see-other-ideas" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-start',
      alignItems: 'center',

    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <TitleWithLogo 
          title="See other ideas"
          logo={'👀 '}
          logoType="light"
          gap={16}
        />
      </Box>
      
      {!loading && !hasIdeasWithStars ? (
        // Mostrar mensaje y botón para votar cuando no hay ideas con estrellas
        <Box sx={{ textAlign: 'center', maxWidth: '600px', marginBottom: '2rem' }}>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--color-text-secondary)', 
            margin: '0 0 1rem 0'
          }}>
            ¡No hay ideas votadas aún! 
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            margin: '0 0 2rem 0'
          }}>
            Sé el primero en votar una idea para que aparezca aquí.
          </p>
          <CleanButton
            text="Votar Primera Idea"
            icon={<Star />}
            iconPosition="left"
            onClick={() => setVoteModalOpen(true)}
            size="large"
            sx={{ fontSize: '1.1rem', padding: '12px 24px' }}
          />
        </Box>
      ) : (
        // Mostrar contenido normal cuando hay ideas con estrellas
        <>
          <Box sx={{ textAlign: 'center', maxWidth: '600px', marginBottom: '2rem' }}>
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--color-text-secondary)', 
              margin: 0
            }}>
              Discover amazing ideas from our community. Get inspired and see what others are creating.
            </p>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            marginBottom: '14px',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '720px', // Mismo ancho que LazyCards
            padding: '0 20px' // Mismo padding interno que LazyCards
          }}>
            <SelectDropdown
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="⭐ Ordenar por estrellas"
              className="ideas-sort-dropdown"
            />
            
            <CleanButton
              text="Votar Más Ideas"
              icon={<Star />}
              iconPosition="left"
              onClick={() => setVoteModalOpen(true)}
              size="medium"
              sx={{marginRight: '15px'}}
            />
          </Box>
          {loading ? (
            <Loading 
              size="large" 
              color="orange" 
              text="Cargando ideas votadas..." 
            />
          ) : (
            <LazyCards ideas={ideas} loading={false} onVoteSubmitted={reloadIdeas} />
          )}
        </>
      )}
      
      {/* Modal de votación */}
      <VoteIdeas
        open={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        onVoteSubmitted={() => {
          console.log('Voto enviado exitosamente!');
          setVoteModalOpen(false);
          reloadIdeas(); // Recargar ideas después de votar
        }}
      />
    </div>
  );
};

export default SeeOtherIdeas;

import React, { useState, useEffect } from 'react';
import Box from '../../base/box/box';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';
import LazyCards from '../../components/LazyCards/LazyCards';
import Loading from '../../components/Loading/Loading';
import SelectDropdown, { type SelectOption } from '../../base/selectDropdown/selectDropdown';
import CleanButton from '../../base/cleanButton/cleanButton';
import VoteIdeas from './voteIdeas';
import { getIdeas, type Idea } from '../../firebase/firestore';
import { Star } from '@mui/icons-material';
import { useT } from '../../components/lenguajes';

interface SeeOtherIdeasProps {
  shouldRefresh?: boolean;
  onRefreshed?: () => void;
}

const SeeOtherIdeas: React.FC<SeeOtherIdeasProps> = ({ shouldRefresh = false, onRefreshed }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [originalIdeas, setOriginalIdeas] = useState<Idea[]>([]); // Para almacenar las ideas originales
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('stars');
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [hasIdeas, setHasIdeas] = useState(true);
  
  const t = useT();

  // Opciones del dropdown para ordenar
  const sortOptions: SelectOption[] = [
    { value: 'stars', label: t.seeIdeas.sorting.byStars },
    { value: 'date', label: t.seeIdeas.sorting.byDate },
    { value: 'views', label: t.seeIdeas.sorting.byViews }
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
        console.log('🔄 Cargando todas las ideas desde Firebase...');
        const ideasFromFirebase = await getIdeas(20); // Obtener las últimas 20 ideas
        setOriginalIdeas(ideasFromFirebase); // Guardar las ideas originales
        setIdeas(sortIdeas(ideasFromFirebase, sortBy)); // Aplicar ordenamiento inicial
        setHasIdeas(ideasFromFirebase.length > 0);
        console.log('✅ Ideas cargadas:', ideasFromFirebase.length);
      } catch (error) {
        console.error('❌ Error cargando ideas:', error);
        setHasIdeas(false);
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

  // useEffect para manejar la actualización automática cuando se envía una nueva idea
  useEffect(() => {
    if (shouldRefresh) {
      console.log('🔄 Actualizando ideas porque se envió una nueva...');
      reloadIdeas().then(() => {
        onRefreshed?.(); // Notificar que ya se actualizó
      });
    }
  }, [shouldRefresh, onRefreshed]);

  // Función para recargar las ideas después de votar
  const reloadIdeas = async () => {
    setLoading(true);
    try {
      console.log('🔄 Recargando ideas después de votar...');
      const ideasFromFirebase = await getIdeas(20);
      setOriginalIdeas(ideasFromFirebase);
      setIdeas(sortIdeas(ideasFromFirebase, sortBy));
      setHasIdeas(ideasFromFirebase.length > 0);
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
          title={t.seeIdeas.title}
          logo={'👀 '}
          logoType="light"
          gap={16}
        />
      </Box>
      
      {!loading && !hasIdeas ? (
        // Mostrar mensaje y botón para votar cuando no hay ideas
        <Box sx={{ textAlign: 'center', maxWidth: '600px', marginBottom: '2rem' }}>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--color-text-secondary)', 
            margin: '0 0 1rem 0'
          }}>
            {t.seeIdeas.noIdeasYet}
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--color-text-secondary)', 
            margin: '0 0 2rem 0'
          }}>
            {t.seeIdeas.noIdeasSubtext}
          </p>
          <CleanButton
            text={t.seeIdeas.voteFirstIdea}
            icon={<Star />}
            iconPosition="left"
            onClick={() => setVoteModalOpen(true)}
            size="large"
            sx={{ fontSize: '1.1rem', padding: '12px 24px' }}
          />
        </Box>
      ) : (
        // Mostrar contenido normal cuando hay ideas
        <>
          <Box sx={{ textAlign: 'center', maxWidth: '600px', marginBottom: '2rem' }}>
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--color-text-secondary)', 
              margin: 0
            }}>
              {t.seeIdeas.subtitle}
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
              placeholder={t.seeIdeas.sorting.byStars}
              className="ideas-sort-dropdown"
            />
            
            <CleanButton
              text={t.seeIdeas.voteMoreIdeas}
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
              text={t.seeIdeas.loading} 
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

import React, { useState, useEffect } from 'react';
import Box from '../../base/box/box';
import TitleWithLogo from '../../components/titleWithLogo/titleWithLogo';
import LazyCards from '../../components/LazyCards';
import SelectDropdown, { type SelectOption } from '../../base/selectDropdown';
import CleanButton from '../../base/cleanButton';
import VoteIdeas from './voteIdeas';
import { getIdeas, type Idea } from '../../firebase/firestore';
import { Star } from '@mui/icons-material';

const SeeOtherIdeas: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('stars');
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  // Opciones del dropdown para ordenar
  const sortOptions: SelectOption[] = [
    { value: 'stars', label: '⭐ Ordenar por estrellas' },
    { value: 'country', label: '🌍 Ordenar por país' },
    { value: 'views', label: '👁️ Ordenar por más vistas' }
  ];

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        console.log('🔄 Cargando ideas desde Firebase...');
        const ideasFromFirebase = await getIdeas(20); // Obtener las últimas 20 ideas
        setIdeas(ideasFromFirebase);
        console.log('✅ Ideas cargadas:', ideasFromFirebase.length);
      } catch (error) {
        console.error('❌ Error cargando ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

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
          placeholder="Ver Ideas Inspiradoras"
          className="ideas-sort-dropdown"
        />
        
        <CleanButton
          text="Votar Ideas"
          icon={<Star />}
          iconPosition="left"
          onClick={() => setVoteModalOpen(true)}
          size="medium"
          sx={{marginRight: '15px'}}
        />
      </Box>
      <LazyCards ideas={ideas} loading={loading} />
      
      {/* Modal de votación */}
      <VoteIdeas
        open={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        onVoteSubmitted={() => {
          // Opcional: recargar ideas cuando se envía un voto
          console.log('Voto enviado exitosamente!');
        }}
      />
    </div>
  );
};

export default SeeOtherIdeas;

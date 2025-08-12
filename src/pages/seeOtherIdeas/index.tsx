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
import { useT } from '../../components/lenguajes/LanguageContext';
import './seeOtherIdeas.css';

interface SeeOtherIdeasProps {
  shouldRefresh?: boolean;
  onRefreshed?: () => void;
}

const SeeOtherIdeas: React.FC<SeeOtherIdeasProps> = ({ shouldRefresh = false, onRefreshed }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [originalIdeas, setOriginalIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('stars');
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [hasIdeas, setHasIdeas] = useState(true);
  
  const t = useT();

  const sortOptions: SelectOption[] = [
    { value: 'stars', label: t.seeIdeas.sorting.byStars },
    { value: 'date', label: t.seeIdeas.sorting.byDate },
    { value: 'views', label: t.seeIdeas.sorting.byViews }
  ];

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
        const ideasFromFirebase = await getIdeas(20);
        setOriginalIdeas(ideasFromFirebase);
        setIdeas(sortIdeas(ideasFromFirebase, sortBy));
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

  useEffect(() => {
    if (originalIdeas.length > 0) {
      console.log('🔄 Aplicando ordenamiento:', sortBy);
      const sortedIdeas = sortIdeas(originalIdeas, sortBy);
      setIdeas(sortedIdeas);
    }
  }, [sortBy, originalIdeas]);

  useEffect(() => {
    if (shouldRefresh) {
      console.log('🔄 Actualizando ideas porque se envió una nueva...');
      reloadIdeas().then(() => {
        onRefreshed?.();
      });
    }
  }, [shouldRefresh, onRefreshed]);

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
    <div className="see-other-ideas see-other-ideas-container">
      <Box className="see-other-ideas-title-box">
        <TitleWithLogo 
          title={t.seeIdeas.title}
          logo={'👀 '}
          logoType="light"
          gap={16}
        />
      </Box>
      
      {!loading && !hasIdeas ? (
        <Box className="see-other-ideas-no-ideas-box">
          <p className="see-other-ideas-no-ideas-title">
            {t.seeIdeas.noIdeasYet}
          </p>
          <p className="see-other-ideas-no-ideas-subtitle">
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
        <>
          <Box className="see-other-ideas-subtitle-box">
            <p className="see-other-ideas-subtitle-text">
              {t.seeIdeas.subtitle}
            </p>
          </Box>

          <Box className="see-other-ideas-controls-box">
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
              className="see-other-ideas-vote-button"
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
      
      <VoteIdeas
        open={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        onVoteSubmitted={() => {
          console.log('Voto enviado exitosamente!');
          setVoteModalOpen(false);
          reloadIdeas();
        }}
      />
    </div>
  );
};

export default SeeOtherIdeas;

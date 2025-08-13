import { useState, useEffect, lazy, Suspense } from 'react';
import { Box } from '@mui/material';
import './App.css';
import SideMenu from './components/SideMenu/SideMenu';
import TopIcons from './components/TopIcons/TopIcons';
import Loading from './components/Loading/Loading';
import { LanguageProvider } from './components/lenguajes/LanguageContext';

// Lazy loading para componentes pesados
const ShareYourIdea = lazy(() => import('./pages/shareYourIdea'));
const SeeOtherIdeas = lazy(() => import('./pages/seeOtherIdeas'));
const AboutUs = lazy(() => import('./pages/aboutUs'));

function App() {
  const [currentPage, setCurrentPage] = useState('shareYourIdea');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dreamWriteShare_theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [shouldRefreshIdeas, setShouldRefreshIdeas] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleDarkModeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('dreamWriteShare_theme', newTheme ? 'dark' : 'light');
  };

  const handleIdeaSubmitted = () => {
    console.log('🔄 Nueva idea enviada, actualizando lista...');
    setShouldRefreshIdeas(true);
  };

  const handleIdeasRefreshed = () => {
    setShouldRefreshIdeas(false);
  };

  return (
    <LanguageProvider>
      <Box sx={{ display: 'flex' }}>
        <TopIcons isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
        <SideMenu currentPage={currentPage} onPageChange={handlePageChange} />
        
        <Box 
          component="main" 
          className="main-content"
        >

          <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Suspense fallback={<Loading size="large" color="orange" text="Cargando..." />}>
              <ShareYourIdea onPageChange={handlePageChange} onIdeaSubmitted={handleIdeaSubmitted} />
            </Suspense>
          </Box>
          
          <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Suspense fallback={<Loading size="large" color="orange" text="Cargando ideas..." />}>
              <SeeOtherIdeas shouldRefresh={shouldRefreshIdeas} onRefreshed={handleIdeasRefreshed} />
            </Suspense>
          </Box>
          
          <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Suspense fallback={<Loading size="large" color="orange" text="Cargando..." />}>
              <AboutUs />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </LanguageProvider>
  );
}

export default App;

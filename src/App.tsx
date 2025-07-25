import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import './App.css';
import SideMenu from './components/SideMenu/SideMenu';
import TopIcons from './components/TopIcons/TopIcons';
import ShareYourIdea from './pages/shareYourIdea';
import SeeOtherIdeas from './pages/seeOtherIdeas';
import AboutUs from './pages/aboutUs';
import { LanguageProvider } from './components/lenguajes';

function App() {
  const [currentPage, setCurrentPage] = useState('shareYourIdea');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize dark mode based on system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [shouldRefreshIdeas, setShouldRefreshIdeas] = useState(false);

  // Apply dark mode class on mount and when state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Función para manejar cuando se envía una nueva idea
  const handleIdeaSubmitted = () => {
    console.log('🔄 Nueva idea enviada, actualizando lista...');
    setShouldRefreshIdeas(true);
  };

  // Función para resetear el estado de refresh
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
          sx={{ 
            flexGrow: 1, 
            ml: '20px',
            minHeight: '100vh'
          }}
        >

          <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShareYourIdea onPageChange={handlePageChange} onIdeaSubmitted={handleIdeaSubmitted} />
          </Box>
          
          <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SeeOtherIdeas shouldRefresh={shouldRefreshIdeas} onRefreshed={handleIdeasRefreshed} />
          </Box>
          
          <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AboutUs />
          </Box>
        </Box>
      </Box>
    </LanguageProvider>
  );
}

export default App;

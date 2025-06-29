
import { useState } from 'react';
import { Box } from '@mui/material';
import './App.css';
import SideMenu from './components/SideMenu/SideMenu';
import ShareYourIdea from './pages/shareYourIdea';
import SeeOtherIdeas from './pages/seeOtherIdeas';
import AboutUs from './pages/aboutUs';

function App() {
  const [currentPage, setCurrentPage] = useState('shareYourIdea');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
          <ShareYourIdea />
        </Box>
        
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SeeOtherIdeas />
        </Box>
        
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AboutUs />
        </Box>
      </Box>
    </Box>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { useT } from '../lenguajes/LanguageContext';

interface SideMenuProps {
  currentPage?: string;
  onPageChange: (page: string) => void;
}

const MenuButton = styled(IconButton)(() => ({
  position: 'fixed',
  top: '1rem',
  left: '1rem',
  zIndex: 1200,
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-background)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  padding: '8px',
  '&:hover': {
    backgroundColor: 'var(--color-button-hover)',
  },
  '@media (min-width: 901px)': {
    display: 'none',
  },
}));

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: '80%',
    maxWidth: '230px',
    backgroundColor: 'var(--color-background)',
    borderRight: '2.5px dashed var(--color-border, #d1d5db)',
    borderLeft: 'none',
    borderTop: 'none',
    borderBottom: 'none',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (max-width: 900px)': {
      width: '80%',
      maxWidth: '250px',
      borderRight: 'none',
      boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
    }
  },
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  cursor: 'pointer',
  padding: '16px 24px',
  margin: '8px 0',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? 'var(--color-primary-light, rgba(255, 255, 255, 0.21))' : 'transparent',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: 'var(--color-hover, rgba(246, 165, 59, 0.05))',
    transform: 'translateX(4px)',
  },
}));

const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  '& .MuiListItemText-primary': {
    fontFamily: 'var(--font-family)',
    fontSize: '1.3rem',
    fontWeight: active ? 700 : 400,
    color: active ? 'var(--color-text)' : 'var(--color-text-secondary)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
}));

const SideMenu: React.FC<SideMenuProps> = ({ onPageChange }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activePageFromScroll, setActivePageFromScroll] = useState('shareYourIdea');
  const [isOpen, setIsOpen] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 900px)');
  const t = useT();

  // Crear menuItems dinámicamente usando las traducciones
  const menuItems = [
    { id: 'share', label: `💡 ${t.navigation.shareYourIdea}`, page: 'shareYourIdea' },
    { id: 'see', label: `👀 ${t.navigation.seeOtherIdeas}`, page: 'seeOtherIdeas' },
    { id: 'about', label: `ℹ️ ${t.navigation.aboutUs}`, page: 'aboutUs' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      const windowHeight = window.innerHeight;
      const scrollPosition = currentScrollY;
      
      let newActivePage = 'shareYourIdea';
      if (scrollPosition > windowHeight * 0.5 && scrollPosition < windowHeight * 1.5) {
        newActivePage = 'seeOtherIdeas';
      } else if (scrollPosition >= windowHeight * 1.5) {
        newActivePage = 'aboutUs';
      }
      
      if (newActivePage !== activePageFromScroll) {
        setActivePageFromScroll(newActivePage);
        onPageChange(newActivePage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePageFromScroll, onPageChange]);


  const getActivePageByScroll = () => {
    const windowHeight = window.innerHeight;
    const scrollPosition = scrollY;
    
    if (scrollPosition < windowHeight * 0.5) return 'shareYourIdea';
    if (scrollPosition < windowHeight * 1.5) return 'seeOtherIdeas';
    return 'aboutUs';
  };

  const activePage = getActivePageByScroll();

  const handleItemClick = (page: string) => {
    onPageChange(page);
    
    let targetPosition = 0;
    switch (page) {
      case 'shareYourIdea':
        targetPosition = 0;
        break;
      case 'seeOtherIdeas':
        targetPosition = window.innerHeight;
        break;
      case 'aboutUs':
        targetPosition = window.innerHeight * 2;
        break;
    }

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <MenuButton 
        onClick={() => setIsOpen(true)}
        aria-label="menu"
      >
        <MenuIcon />
      </MenuButton>

      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? isOpen : true}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ 
          marginTop: { xs: 0, md: '-200px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          pt: { xs: 4, md: 0 }
        }}>
          <List sx={{ width: '100%' }}>
            {menuItems.map((item) => (
              <StyledListItem
                key={item.id}
                active={activePage === item.page}
                onClick={() => {
                  handleItemClick(item.page);
                  if (isMobile) setIsOpen(false);
                }}
              >
                <StyledListItemText
                  primary={item.label}
                  active={activePage === item.page}
                />
              </StyledListItem>
            ))}
          </List>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default SideMenu;

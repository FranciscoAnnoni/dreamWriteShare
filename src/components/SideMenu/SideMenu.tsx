import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface SideMenuProps {
  currentPage?: string;
  onPageChange: (page: string) => void;
}

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: 230,
    backgroundColor: 'var(--color-background)',
    borderRight: '2.5px dashed var(--color-border, #d1d5db)',
    borderLeft: 'none',
    borderTop: 'none',
    borderBottom: 'none',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

const menuItems = [
  { id: 'share', label: '💡 Share your idea', page: 'shareYourIdea' },
  { id: 'see', label: '👀 See other ideas', page: 'seeOtherIdeas' },
  { id: 'about', label: 'ℹ️ About Us', page: 'aboutUs' },
];

const SideMenu: React.FC<SideMenuProps> = ({ onPageChange }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activePageFromScroll, setActivePageFromScroll] = useState('shareYourIdea');

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
    <StyledDrawer
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ 
        marginTop: '-200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}>
        <List sx={{ width: '100%' }}>
          {menuItems.map((item) => (
            <StyledListItem
              key={item.id}
              active={activePage === item.page}
              onClick={() => handleItemClick(item.page)}
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
  );
};

export default SideMenu;

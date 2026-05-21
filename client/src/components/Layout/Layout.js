import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
        open={loading}
      >
        <CircularProgress color="primary" size={60} />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      {/* Main content with top padding to account for fixed header */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: '64px', sm: '70px' }, // Header height offset
          minHeight: 'calc(100vh - 64px)' // Ensure minimum height
        }}
      >
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout; 
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Link as MuiLink,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [newsletterAlert, setNewsletterAlert] = useState({ open: false, message: '', severity: 'success' });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would make an API call
      setNewsletterAlert({
        open: true,
        message: 'Successfully subscribed to our newsletter!',
        severity: 'success'
      });
      setEmail('');
    }
  };

  const handleAlertClose = () => {
    setNewsletterAlert({ ...newsletterAlert, open: false });
  };

  // Smooth scroll helper function
const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};


  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 1.5
        }}
      >
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 2C14.5 3.5 13.5 5.5 13.5 8C13.5 10.5 14.5 12.5 16 14C17.5 12.5 18.5 10.5 18.5 8C18.5 5.5 17.5 3.5 16 2Z"
            fill="#FFFFFF"
          />
          <path
            d="M22 8C20.5 9.5 19.5 11.5 19.5 14C19.5 16.5 20.5 18.5 22 20C23.5 18.5 24.5 16.5 24.5 14C24.5 11.5 23.5 9.5 22 8Z"
            fill="#FFFFFF"
          />
          <path
            d="M10 8C8.5 9.5 7.5 11.5 7.5 14C7.5 16.5 8.5 18.5 10 20C11.5 18.5 12.5 16.5 12.5 14C12.5 11.5 11.5 9.5 10 8Z"
            fill="#FFFFFF"
          />
          <path
            d="M16 16C14.5 17.5 13.5 19.5 13.5 22C13.5 24.5 14.5 26.5 16 28C17.5 26.5 18.5 24.5 18.5 22C18.5 19.5 17.5 17.5 16 16Z"
            fill="#D4B896"
          />
        </svg>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
        Yogastic
      </Typography>
    </Box>
  );

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/explore-yoga' },
    { label: 'blog', path: '/blogs' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const serviceLinks = [
    { label: 'Prenatal Yoga', path: '/explore-yoga' },
    { label: 'Meditation', path: '/explore-yoga' },
    { label: 'Nutrition Consultation', path: '/explore-yoga' },
    { label: 'Hatha Yoga', path: '/explore-yoga' },
    { label: 'Kundalini Yoga', path: '/explore-yoga' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Logo />
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6,color: theme.palette.background.paper}}>
              Discover inner peace and physical wellness through our comprehensive yoga programs. 
              Join our community and start your journey to a healthier, more balanced life.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                   color: theme.palette.background.paper,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    
                  }}
                  onClick={handleScrollToTop}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {serviceLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  to={'/explore-yoga'}
                  sx={{
                    color: theme.palette.background.paper,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    
                  }}
                  onclick={handleScrollToTop}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, color: theme.palette.background.paper }} />
                <Typography variant="body2" sx={{ color: theme.palette.background.paper}}>
                  +61 3 8376 6284
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18,color: theme.palette.background.paper }} />
                <Typography variant="body2" sx={{ color: theme.palette.background.paper}}>
                  info@yogastic.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18,color: theme.palette.background.paper, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: theme.palette.background.pape,color: theme.palette.background.paper}}>
                  21 King Street Melbourne,<br />3000, Australia
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Newsletter Section */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Get the Latest Updates With Our Newsletter
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, maxWidth: 600, mx: 'auto' ,color: theme.palette.background.paper}}>
            Stay informed about our latest yoga classes, wellness tips, and special events. 
            Join our community for weekly inspiration.
          </Typography>
          
          <Box
            component="form"
            onSubmit={handleNewsletterSubmit}
            sx={{
              display: 'flex',
              maxWidth: 400,
              mx: 'auto',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <TextField
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.secondary.main
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1
                  }
                }
              }}
            />
            <Button
              type="submit"
              variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: theme.palette.secondary.main,
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>

        {/* Copyright */}
        <Divider sx={{ my: 4,color: theme.palette.background.paper }} />
        <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8 ,color: theme.palette.background.paper}}>
          © {new Date().getFullYear()} Yogastic. All rights reserved. Built with love for wellness and mindfulness.
        </Typography>
      </Container>

      {/* Newsletter Alert */}
      <Snackbar
        open={newsletterAlert.open}
        autoHideDuration={4000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={newsletterAlert.severity}>
          {newsletterAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer; 

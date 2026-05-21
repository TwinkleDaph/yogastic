import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme
} from '@mui/material';

const About = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 600, mb: 3 }}>
            About Yogastic
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Your journey to wellness starts here
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Box sx={{ py: 8 ,color: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }} color="text.primary">
            Our Story
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }} color="text.primary">
            Welcome to Yogastic, where ancient wisdom meets modern wellness. Founded with a passion for 
            holistic health and mindful living, we believe that yoga is more than just physical exercise – 
            it's a transformative journey that heals the mind, body, and spirit.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }} color="text.primary">
            Our expert instructors bring years of experience and a deep understanding of traditional yoga 
            practices, combined with contemporary approaches to wellness. Whether you're a complete beginner 
            or an experienced practitioner, we offer personalized guidance to help you achieve your wellness goals.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7 }} color="text.primary">
            Join our community and discover the profound benefits of regular yoga practice, meditation, 
            and mindful living. Together, we'll create a space of healing, growth, and transformation.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 
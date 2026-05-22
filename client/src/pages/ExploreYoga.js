import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Avatar
} from '@mui/material';
import {
  SelfImprovement,
  Psychology,
  FitnessCenter,
  LocalDining,
  Spa,
  AccessTime,
  ArrowForward
} from '@mui/icons-material';
import { Link} from 'react-router-dom';

const ExploreYoga = () => {
  const theme = useTheme();

  const yogaTypes = [
    {
      title: 'Vinyasa Yoga',
      description: 'Flow through dynamic sequences that link breath with movement',
      icon: <SelfImprovement />,
      duration: '60 mins',
      level: 'All Levels'
    },
    {
      title: 'Hatha Yoga',
      description: 'Traditional poses held for longer periods to build strength and flexibility',
      icon: <FitnessCenter />,
      duration: '75 mins',
      level: 'Beginner'
    },
    {
      title: 'Meditation',
      description: 'Mindfulness and breathing practices for mental clarity and peace',
      icon: <Psychology />,
      duration: '30 mins',
      level: 'All Levels'
    },
    {
      title: 'Prenatal Yoga',
      description: 'Safe and gentle practice designed specifically for expecting mothers',
      icon: <Spa />,
      duration: '60 mins',
      level: 'Prenatal'
    },
    {
      title: 'Kundalini Yoga',
      description: 'Spiritual practice combining movement, breath, and chanting',
      icon: <Psychology />,
      duration: '90 mins',
      level: 'Intermediate'
    },
    {
      title: 'Nutrition Consultation',
      description: 'Personalized nutrition guidance to support your wellness journey',
      icon: <LocalDining />,
      duration: '45 mins',
      level: 'Individual'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 600, mb: 3 }}>
            Explore Our Services
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Discover a variety of yoga practices and wellness services designed to meet your unique needs
          </Typography>
        </Container>
      </Box>

      {/* Services Grid */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {yogaTypes.map((yoga, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: theme.palette.primary.main,
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      {React.cloneElement(yoga.icon, { sx: { fontSize: 40 } })}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      {yoga.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {yoga.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                        <Typography variant="caption">{yoga.duration}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {yoga.level}
                      </Typography>
                    </Box>
                    
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          bgcolor:'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md" >
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }} color="text.primary">
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }} color="text.primary">
            Join our community and experience the transformative power of yoga
          </Typography>
          <Button
            variant="outlined"
                    component={Link}
                                to="/contact"
                    size="large"
                    sx={{
                      borderColor: theme.palette.text.primary,
                      color: ' theme.palette.text.primary',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
            
          >
            Book a Session
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default ExploreYoga; 
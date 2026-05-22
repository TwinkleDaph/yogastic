import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  SelfImprovement,
  FitnessCenter,
  Psychology,
  LocalDining,
  ArrowForward,
  PlayArrow,
  CheckCircle
} from '@mui/icons-material';
import { Link,useNavigate} from 'react-router-dom';

const Home = () => {
  const theme = useTheme();

  const services = [
    {
      title: 'Prenatal Yoga',
      description: 'Safe and gentle yoga practices designed specifically for expecting mothers.',
      icon: <SelfImprovement />,
      image: '/api/placeholder/300/200',
      category: 'YOGA'
    },
    {
      title: 'Meditation',
      description: 'Mindfulness practices to help you find inner peace and mental clarity.',
      icon: <Psychology />,
      image: '/api/placeholder/300/200',
      category: 'MEDITATION'
    },
    {
      title: 'Nutrition Consultation',
      description: 'Personalized nutrition plans to support your wellness journey.',
      icon: <LocalDining />,
      image: '/api/placeholder/300/200',
      category: 'NUTRITION'
    },
    {
      title: 'Hatha Yoga',
      description: 'Traditional yoga poses and breathing techniques for all levels.',
      icon: <FitnessCenter />,
      image: '/api/placeholder/300/200',
      category: 'FITNESS'
    }
  ];

  const features = [
    'Vinyasa Yoga',
    'Slow Yoga',
    'Intuitive Yoga',
    'Aroma Yoga',
    'Kundalini Yoga',
    'Bikram Yoga',
    'Mindfulness Training',
    'Workout Routines'
  ];
  
  //navogation for learn more
  const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '-5%',
            width: 200,
            height: 200,
            opacity: 0.1,
            transform: 'rotate(45deg)'
          }}
        >
          <SelfImprovement sx={{ fontSize: 200 }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '-5%',
            width: 150,
            height: 150,
            opacity: 0.1,
            transform: 'rotate(-30deg)'
          }}
        >
          <Psychology sx={{ fontSize: 150 }} />
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white' }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: theme.palette.secondary.main,
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em'
                  }}
                >
                  START A HAPPY LIFE
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.1
                  }}
                >
                  Start Healing
                  <br />
                  Your Mind,
                  <br />
                  <Box
                    component="span"
                    sx={{ color: theme.palette.secondary.main }}
                  >
                    Body &
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    maxWidth: 500,
                    lineHeight: 1.6
                  }}
                >
                  Discover inner peace and physical wellness through our comprehensive yoga programs and mindfulness practices.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                   component={Link}
                  to="/login"
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
                    onClick={handleScrollToTop}
                  >
                    Get Started
                  </Button>
                  <Button
                  component={Link}
                  to="about"
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
                    onClick={handleScrollToTop}

                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                {/* Placeholder for yoga pose image */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 500,
                    mx: 'auto',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  
                  <SelfImprovement
                    sx={{
                      fontSize: 120,
                      color: theme.palette.secondary.main,
                      opacity: 0.8
                    }}
                  />
                </Box>
                
              </Box>
            </Grid>
          </Grid>
        </Container>

       
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.1em'
              }}
            >
              OUR SERVICES
            </Typography>
            <Typography variant="h2" color="text.primary" sx={{ fontWeight: 600, mb: 3 }}>
              Practice Wherever You Want
              <br />
              Whenever You Need
            </Typography>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Explore our diverse range of yoga practices and wellness services designed to meet you wherever you are in your journey.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <Chip
                      label={service.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {React.cloneElement(service.icon, { sx: { fontSize: 40 } })}
                    </Avatar>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.primary.light} 100%)`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <FitnessCenter
                  sx={{
                    fontSize: 150,
                    color: 'rgba(255, 255, 255, 0.3)'
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em'
                }}
              >
                ABOUT US
              </Typography>
              <Typography variant="h2" color="text.primary" sx={{ fontWeight: 600, mb: 3 }}>
                Take Your Yoga to
                the Next Level
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ mb: 4, lineHeight: 1.7 }}>
                Transform your mind, body, and spirit through our comprehensive yoga programs. 
                Whether you're a beginner or advanced practitioner, our expert instructors will 
                guide you on a journey of self-discovery and wellness.
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ mb: 4, lineHeight: 1.7 }}>
                Experience the perfect blend of traditional wisdom and modern techniques in a 
                supportive, inclusive environment designed to help you achieve your wellness goals.
              </Typography>
              <Button
                component={Link}
                to="/about"
               variant="outlined"
                     
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
                onClick={handleScrollToTop}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" color="text.primary" sx={{ fontWeight: 600, mb: 3 }}>
              Why Choose Us
            </Typography>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Discover the comprehensive benefits of our holistic approach to yoga and wellness.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(139, 74, 156, 0.05)'
                    }
                  }}
                >
                  <CheckCircle
                    sx={{
                      fontSize: 48,
                      color: theme.palette.primary.main,
                      mb: 2
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }} color="text.primary">
                    {feature}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                    Expert guidance and personalized approach
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 600, mb: 3 }}>
            Get a Free
            <br />
            Consultation Now
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Ready to begin your wellness journey? Schedule your free consultation today 
            and discover how yoga can transform your life.
          </Typography>
          <Button
            component={Link}
            to="/contact"
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
                    onClick={handleScrollToTop}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Home; 
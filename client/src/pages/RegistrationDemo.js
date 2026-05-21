import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  useTheme,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Person,
  AppRegistration,
  ArrowForward
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const RegistrationDemo = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.primary.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <AppRegistration sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
              Choose Your Registration Method
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Select the registration option that best suits your needs
            </Typography>
          </Box>

          {/* Registration Options */}
          <Grid container spacing={4} justifyContent="center">
            {/* Basic Registration */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: `2px solid ${theme.palette.grey[300]}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Person sx={{ fontSize: 32, color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Basic Registration
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Quick and simple registration with essential information:
                  </Typography>
                  
                  <Box component="ul" sx={{ mb: 4, pl: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>Name and contact details</Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>Email and password</Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>Optional profile photo</Typography>
                    <Typography component="li" variant="body2">Basic bio information</Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    fullWidth
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ py: 1.5 }}
                  >
                    Quick Registration
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Enhanced Registration */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: `2px solid ${theme.palette.primary.main}`,
                  bgcolor: `${theme.palette.primary.main}05`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[12]
                  },
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {/* Recommended Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 20,
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  RECOMMENDED
                </Box>

                <CardContent sx={{ p: 4, textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AppRegistration sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Complete Registration
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Comprehensive form for personalized yoga experience:
                  </Typography>
                  
                  <Box component="ul" sx={{ mb: 4, pl: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>Complete personal details</Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>Height, weight, and health info</Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>Preferred time slots</Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>Medical conditions (optional)</Typography>
                    <Typography component="li" variant="body2">Personalized class recommendations</Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/user-registration"
                    variant="contained"
                    fullWidth
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ py: 1.5 }}
                  >
                    Complete Registration
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" color="text.secondary">
              Both options are free and secure. You can always update your profile later.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationDemo;
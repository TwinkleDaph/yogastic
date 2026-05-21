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
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Home,
  Email,
  Schedule
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const RegistrationSuccess = () => {
  const theme = useTheme();
  const location = useLocation();
  const { message, userData } = location.state || {};

  const timeSlotOptions = {
    'morning_6_730': 'Morning (6:00 AM - 7:30 AM)',
    'morning_730_9': 'Morning (7:30 AM - 9:00 AM)',
    'evening_430_6': 'Evening (4:30 PM - 6:00 PM)',
    'evening_6_730': 'Evening (6:00 PM - 7:30 PM)'
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
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
          {/* Success Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <CheckCircle sx={{ fontSize: 48, color: 'white' }} />
          </Box>

          {/* Success Message */}
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: theme.palette.success.main }}>
            Welcome to Yogastic!
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {message || 'Your registration has been completed successfully.'}
          </Typography>

          {/* User Information Summary */}
          {userData && (
            <Card sx={{ mb: 4, bgcolor: theme.palette.background.alt }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Registration Summary
                </Typography>
                <Grid container spacing={2} sx={{ textAlign: 'left' }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {userData.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {userData.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {userData.phone}
                    </Typography>
                    {userData.age && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Age:</strong> {userData.age} years
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Height:</strong> {userData.height} cm
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Weight:</strong> {userData.weight} kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Gender:</strong> {userData.gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Preferred Time:</strong> {timeSlotOptions[userData.preferredTimeSlot]}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          <Divider sx={{ mb: 4 }} />

          {/* Next Steps */}
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            What's Next?
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Email sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Check Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We've sent you a confirmation email with next steps
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Schedule sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Class Schedule
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our team will contact you within 24 hours about your preferred time slot
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Home sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Explore More
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse our blog and learn about yoga practices
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              startIcon={<Home />}
              sx={{ px: 4 }}
            >
              Go to Home
            </Button>
            <Button
              component={Link}
              to="/blogs"
              variant="outlined"
              size="large"
              sx={{ px: 4 }}
            >
              Read Our Blog
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" color="text.secondary">
              Questions? Contact us at{' '}
              <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                support@yogastic.com
              </Typography>
              {' '}or call{' '}
              <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                +1 (555) 123-4567
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationSuccess;
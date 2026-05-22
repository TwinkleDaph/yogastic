import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';

const Contact = () => {
  const theme = useTheme();
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    // In a real app, this would send the contact form data to the backend
    console.log('Contact form data:', data);
    setAlert({
      open: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      severity: 'success'
    });
    reset();
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const contactInfo = [
    {
      title: 'Email',
      value: 'info@yogastic.com',
      icon: <Email />,
      description: 'Send us an email anytime'
    },
    {
      title: 'Phone',
      value: '+61 3 8376 6284',
      icon: <Phone />,
      description: 'Call us during business hours'
    },
    {
      title: 'Address',
      value: '21 King Street Melbourne, 3000, Australia',
      icon: <LocationOn />,
      description: 'Visit our studio'
    },
    {
      title: 'Hours',
      value: 'Mon-Fri: 6AM-9PM, Sat-Sun: 8AM-6PM',
      icon: <AccessTime />,
      description: 'Our operating hours'
    }
  ];

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
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            We'd love to hear from you. Get in touch with our team for any questions or inquiries.
          </Typography>
        </Container>
      </Box>

      {/* Contact Info & Form */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 4,color:'text.primary' }}>
                Get in Touch
              </Typography>
              <Grid container spacing={3}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      sx={{
                        p: 3,
                        height: '100%',
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: theme.palette.primary.main,
                            color: 'white'
                          }}
                        >
                          {info.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {info.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {info.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {info.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
                  Send Message
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        {...register('firstName', {
                          required: 'First name is required'
                        })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        {...register('lastName', {
                          required: 'Last name is required'
                        })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        {...register('subject', {
                          required: 'Subject is required'
                        })}
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={5}
                        {...register('message', {
                          required: 'Message is required',
                          minLength: {
                            value: 10,
                            message: 'Message must be at least 10 characters'
                          }
                        })}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                     
                    size="large"
                    sx={{
                      borderColor: theme.palette.text.primary,
                      color: ' theme.palette.text.primary',
                    
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact; 
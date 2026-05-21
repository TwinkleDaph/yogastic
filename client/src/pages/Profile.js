import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  Email,
  Phone,
  CalendarMonth,
  Badge
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
   const theme = useTheme();
  const { user } = useAuth();
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Loading profile...
        </Typography>
      </Container>
    );
  }
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getInitials = (firstName, lastName) => {
    return `${(firstName || 'U').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };
  const profilePhotoUrl = user.profilePhoto 
    ? (user.profilePhoto.startsWith('http') 
        ? user.profilePhoto 
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/profiles/${user.profilePhoto}`)
    : null;
  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header Section */}
        <Card sx={{ mb: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              py: 4,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Avatar
              src={profilePhotoUrl}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                bgcolor: 'secondary.main',
                border: '4px solid white',
                boxShadow: theme.shadows[4]
              }}
            >
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
            
            <Typography variant="h4" sx={{ mt: 2, color: 'white', fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            
            <Chip
              label={user.role ? user.role.toUpperCase() : 'USER'}
              sx={{
                mt: 1,
                bgcolor: user.role === 'admin' ? 'secondary.main' : 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        </Card>
        {/* Profile Details Section */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Profile Details
            </Typography>
            
            <Grid container spacing={3}>
              {/* Email */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Email sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* Phone */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Phone sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Phone Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.phone || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* Bio */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Bio
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.bio || 'No bio yet'}
                  </Typography>
                </Box>
              </Grid>
              {/* Member Since */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <CalendarMonth sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Member Since
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* Role */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Badge sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Account Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                      {user.role || 'user'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
export default Profile;
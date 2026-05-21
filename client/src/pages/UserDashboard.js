import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Alert,
  Skeleton,
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  Person,
  Spa,
  AccessTime,
  CalendarMonth
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePackages, setActivePackages] = useState([]);
  const [packageStats, setPackageStats] = useState({ active: 0, totalDays: 0, remainingDays: 0 });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsResponse] = await Promise.all([
        transactionAPI.getMyTransactions()
      ]);

      if (transactionsResponse.data.success) {
        const activeTxns = transactionsResponse.data.activeTransactions || [];
        setActivePackages(activeTxns);

        const calculateRemainingDays = (endDate) => {
          const now = new Date();
          const end = new Date(endDate);
          const diff = end - now;
          return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        };

        let totalDays = 0;
        let remainingDays = 0;
        activeTxns.forEach(txn => {
          if (txn.packageId) {
            const pkgDuration = txn.packageId.duration || 0;
            totalDays += pkgDuration;
            remainingDays += calculateRemainingDays(txn.endDate);
          }
        });
        setPackageStats({
          active: activeTxns.length,
          totalDays,
          remainingDays
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load dashboard data');
      
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateRemainingDays = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const DashboardCard = ({ title, value, subtitle, icon, color = 'primary', onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? theme.shadows[4] : theme.shadows[1]
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: 3,
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {loading ? <Skeleton width={60} /> : value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: `${color}.main`, fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Dashboard sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.firstName || user?.name}! Here's your yoga blogging activity.
        </Typography>
      </Box>

      {/* Stats Cards */}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Active Packages"
            value={packageStats.active}
            subtitle="Subscribed"
            icon={<Spa sx={{ fontSize: 28 }} />}
            color="success"
            onClick={() => navigate('/my-packages')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Duration"
            value={`${packageStats.totalDays} days`}
            subtitle="Yoga journey"
            icon={<CalendarMonth sx={{ fontSize: 28 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Days Remaining"
            value={packageStats.remainingDays}
            subtitle="Keep going!"
            icon={<AccessTime sx={{ fontSize: 28 }} />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                Profile Overview
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={user?.profilePhoto}
                  alt={user?.firstName || user?.name}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {(user?.firstName || user?.name || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user?.fullName || `${user?.firstName} ${user?.lastName}` || user?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Chip 
                    label={user?.role || 'user'} 
                    size="small" 
                    color="primary" 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Member Since
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatDate(user?.createdAt)}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
               
                onClick={() => navigate('/profile')}
                sx={{ mt: 2 }}
              >
              Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

       
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
             {/* Active Packages Section */}
      {activePackages.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <Spa sx={{ mr: 1 }} />
              My Active Packages
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {activePackages.slice(0, 3).map((txn) => (
              <Grid item xs={12} md={4} key={txn._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {txn.packageId?.name || 'Package'}
                      </Typography>
                      <Chip
                        label="Active"
                        size="small"
                        color="success"
                        sx={{ height: 20 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {txn.packageId?.duration} {txn.packageId?.durationUnit}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarMonth sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Ends: {new Date(txn.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 500, color: 'success.main' }}>
                        {(() => {
                          const remaining = calculateRemainingDays(txn.endDate);
                          return `${remaining} days remaining`;
                        })()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      

      

      </Container>
  );
};

export default UserDashboard;
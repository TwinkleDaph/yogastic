import React, { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  Fade
} from '@mui/material';
import {
  Spa,
  AccessTime,
  LocalOffer,
  Search,
  CheckCircle
} from '@mui/icons-material';
import { packageAPI } from '../services/api';

const Packages = () => {
  const theme = useTheme();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await packageAPI.getPackages();
      if (response.data.success) {
        setPackages(response.data.packages);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const getEffectivePrice = (pkg) => {
    if (pkg.discount > 0) {
      return pkg.price * (1 - pkg.discount / 100);
    }
    return pkg.price;
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pkg.category === categoryFilter;
const matchesLevel = levelFilter === 'all' || pkg.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const PackageCard = ({ pkg }) => {
    const effectivePrice = getEffectivePrice(pkg);
    const hasDiscount = pkg.discount > 0;

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 4
          }
        }}
      >
        <Box 
          sx={{
            p: 2,
            background: hasDiscount ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={pkg.category}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
            />
            {hasDiscount && (
              <Chip
                icon={<LocalOffer />}
                label={`${pkg.discount}% OFF`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: '#f57c00',
                  fontWeight: 600
                }}
              />
            )}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {pkg.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTime sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {pkg.duration} {pkg.durationUnit}
            </Typography>
            <Chip
              label={pkg.level}
              size="small"
              sx={{ ml: 2 }}
              color={pkg.level === 'beginner' ? 'success' : pkg.level === 'intermediate' ? 'warning' : 'info'}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 60 }}>
            {pkg.description}
          </Typography>

          {pkg.features && pkg.features.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {pkg.features.slice(0, 3).map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                  <Typography variant="body2">{feature}</Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 'auto' }}>
            {hasDiscount && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  mr: 1
                }}
              >
                 ₹{pkg.price.toFixed(2)}
              </Typography>
            )}
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ₹{effectivePrice.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              / {pkg.durationUnit === 'months' ? 'month' : pkg.durationUnit}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };
 

  return (
    <Box>
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Yoga Packages
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Choose the perfect yoga package for your wellness journey. All packages include
            expert guidance and unlimited access to yoga sessions.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />

        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card>
                  <Skeleton variant="rectangular" height={120} />
                  <CardContent>
                    <Skeleton variant="text" height={32} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="text" height={40} width="30%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredPackages.length > 0 ? (
          <Grid container spacing={3}>
            {filteredPackages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg._id}>
                <Fade in timeout={500}>
                  <Box>
                    <PackageCard pkg={pkg}/>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Spa sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              No packages found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or check back later.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Packages;
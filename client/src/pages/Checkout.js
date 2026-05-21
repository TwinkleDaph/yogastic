import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  CreditCard,
  AccountBalance,
  Smartphone,
  CheckCircle,
  AccessTime,
  AttachMoney,
  LocalOffer
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { packageAPI, transactionAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPackage();
  }, [id, isAuthenticated, navigate]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await packageAPI.getPackage(id);
      if (response.data.success) {
        setPkg(response.data.package);
      }
    } catch (err) {
      console.error('Error fetching package:', err);
      setError('Package not found');
    } finally {
      setLoading(false);
    }
  };

  const getEffectivePrice = () => {
    if (!pkg) return 0;
    if (pkg.discount > 0) {
      return pkg.price * (1 - pkg.discount / 100);
    }
    return pkg.price;
  };

  const getEndDate = () => {
    if (!pkg) return '';
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (pkg.durationUnit === 'days') {
      endDate.setDate(endDate.getDate() + pkg.duration);
    } else if (pkg.durationUnit === 'weeks') {
      endDate.setDate(endDate.getDate() + (pkg.duration * 7));
    } else if (pkg.durationUnit === 'months') {
      endDate.setMonth(endDate.getMonth() + pkg.duration);
    }

    return endDate.toLocaleDateString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      console.log('=== CHECKOUT SUBMIT ===');
      console.log('Package ID:', id);
      console.log('Payment Method:', paymentMethod);

      const response = await transactionAPI.createTransaction({
        packageId: id,
        paymentMethod
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        setSuccess(true);
        setTransaction(response.data.transaction);
      }
    } catch (err) {
      console.error('Payment error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading package...</Typography>
      </Container>
    );
  }

  if (!pkg) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error">Package not found</Alert>
        <Button onClick={() => navigate('/packages')} sx={{ mt: 2 }}>
          Back to Packages
        </Button>
      </Container>
    );
  }

  if (success && transaction) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your package "{pkg.name}" is now active.
          </Typography>

          <Card sx={{ bgcolor: 'grey.100', p: 3, mb: 4, textAlign: 'left' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Package</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{pkg.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Duration</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {pkg.duration} {pkg.durationUnit}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Start Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {new Date(transaction.startDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">End Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {new Date(transaction.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Amount Paid</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                  ${transaction.paymentAmount.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {transaction.transactionId}
                </Typography>
              </Grid>
            </Grid>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="outlined" onClick={() => navigate('/packages')}>
              Browse More Packages
            </Button>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/packages')}
          sx={{ mb: 3 }}
        >
          Back to Packages
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
          Checkout
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Package Details
                </Typography>

                <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {pkg.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <AccessTime sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {pkg.duration} {pkg.durationUnit}
                        </Typography>
                      </Box>
                    </Box>
                    {pkg.discount > 0 && (
                      <Chip
                        icon={<LocalOffer />}
                        label={`${pkg.discount}% OFF`}
                        color="warning"
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {pkg.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Payment Method
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCard sx={{ mr: 1 }} />
                          Credit/Debit Card
                        </Box>
                      }
                      sx={{ mb: 1 }}
                    />
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Smartphone sx={{ mr: 1 }} />
                          UPI
                        </Box>
                      }
                      sx={{ mb: 1 }}
                    />
                    <FormControlLabel
                      value="netbanking"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccountBalance sx={{ mr: 1 }} />
                          Net Banking
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  sx={{ mb: 2 }}
                  disabled={paymentMethod !== 'card'}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry"
                      placeholder="MM/YY"
                      disabled={paymentMethod !== 'card'}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      type="password"
                      placeholder="123"
                      disabled={paymentMethod !== 'card'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Original Price</Typography>
                    <Typography variant="body1">${pkg.price.toFixed(2)}</Typography>
                  </Box>
                  {pkg.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" color="success.main">Discount</Typography>
                      <Typography variant="body1" color="success.main">
                        -${(pkg.price * pkg.discount / 100).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ${getEffectivePrice().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
                >
                  {submitting ? 'Processing...' : 'Pay Now'}
                </Button>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                  Your subscription will start from today and end on {getEndDate()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
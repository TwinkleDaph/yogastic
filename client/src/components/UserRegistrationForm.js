import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  InputAdornment,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton
} from '@mui/material';
import {
  Email,
  Person,
  Phone,
  Height,
  MonitorWeight,
  Home,
  Schedule,
  MedicalServices,
  CalendarToday,
  Wc,
  CheckCircle,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const UserRegistrationForm = ({ onSubmit, loading = false }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      height: '',
      weight: '',
      dateOfBirth: null,
      gender: '',
      address: '',
      preferredTimeSlot: '',
      age: '',
      medicalConditions: '',
      agreeToUpdates: false
    }
  });

  const steps = ['Personal Details', 'Health & Fitness', 'Preferences & Consent'];

  const timeSlotOptions = [
    { value: 'morning_6_730', label: 'Morning (6:00 AM - 7:30 AM)' },
    { value: 'morning_730_9', label: 'Morning (7:30 AM - 9:00 AM)' },
    { value: 'evening_430_6', label: 'Evening (4:30 PM - 6:00 PM)' },
    { value: 'evening_6_730', label: 'Evening (6:00 PM - 7:30 PM)' }
  ];

  const handleNext = async () => {
    let fieldsToValidate = [];
    
    if (activeStep === 0) {
      fieldsToValidate = ['fullName', 'email', 'phoneNumber', 'password', 'confirmPassword', 'height', 'weight', 'dateOfBirth', 'gender', 'address'];
    } else if (activeStep === 1) {
      fieldsToValidate = ['preferredTimeSlot'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onFormSubmit = async (data) => {
    try {
      setSubmitError('');
      await onSubmit(data);
    } catch (error) {
      setSubmitError('Registration failed. Please try again.');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Basic Personal Details
              </Typography>
            </Grid>

            {/* Full Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters'
                  }
                })}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Email Address */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[\d\s\-\(\)]{10,}$/,
                    message: 'Invalid phone number'
                  }
                })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
                    message: 'Password must contain at least one letter and one number'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value =>
                    value === watch('password') || 'Passwords do not match'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Height */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                {...register('height', {
                  required: 'Height is required',
                  min: {
                    value: 100,
                    message: 'Height must be at least 100 cm'
                  },
                  max: {
                    value: 250,
                    message: 'Height must be less than 250 cm'
                  }
                })}
                error={!!errors.height}
                helperText={errors.height?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Height color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Weight */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                {...register('weight', {
                  required: 'Weight is required',
                  min: {
                    value: 30,
                    message: 'Weight must be at least 30 kg'
                  },
                  max: {
                    value: 300,
                    message: 'Weight must be less than 300 kg'
                  }
                })}
                error={!!errors.weight}
                helperText={errors.weight?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonitorWeight color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{
                    required: 'Date of birth is required'
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Date of Birth"
                      value={field.value}
                      onChange={field.onChange}
                      maxDate={new Date()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.dateOfBirth}
                          helperText={errors.dateOfBirth?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="action" />
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Gender"
                      startAdornment={
                        <InputAdornment position="start">
                          <Wc color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <FormHelperText>{errors.gender.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Age (Optional) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age (Optional)"
                type="number"
                {...register('age', {
                  min: {
                    value: 5,
                    message: 'Age must be at least 5'
                  },
                  max: {
                    value: 120,
                    message: 'Age must be less than 120'
                  }
                })}
                error={!!errors.age}
                helperText={errors.age?.message}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                {...register('address', {
                  required: 'Address is required',
                  minLength: {
                    value: 10,
                    message: 'Address must be at least 10 characters'
                  }
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Health & Fitness Information
              </Typography>
            </Grid>

            {/* Preferred Time Slot */}
            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.preferredTimeSlot}>
                <FormLabel component="legend" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="action" />
                    Preferred Time Slot
                  </Box>
                </FormLabel>
                <Controller
                  name="preferredTimeSlot"
                  control={control}
                  rules={{ required: 'Please select a preferred time slot' }}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      sx={{ ml: 2 }}
                    >
                      {timeSlotOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                          sx={{ 
                            mb: 1,
                            '& .MuiFormControlLabel-label': {
                              fontSize: '0.95rem'
                            }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.preferredTimeSlot && (
                  <FormHelperText>{errors.preferredTimeSlot.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Medical Conditions/Injuries */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Any Medical Conditions/Injuries (Optional)"
                multiline
                rows={4}
                placeholder="Please describe any medical conditions, injuries, or physical limitations we should be aware of..."
                {...register('medicalConditions', {
                  maxLength: {
                    value: 1000,
                    message: 'Medical conditions description must be less than 1000 characters'
                  }
                })}
                error={!!errors.medicalConditions}
                helperText={errors.medicalConditions?.message || 'This information helps us provide better guidance'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <MedicalServices color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Consent & Submission
              </Typography>
            </Grid>

            {/* Form Summary */}
            <Grid item xs={12}>
              <Card sx={{ bgcolor: theme.palette.background.alt, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Registration Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Name:</strong> {watch('fullName') || 'Not provided'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Email:</strong> {watch('email') || 'Not provided'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Phone:</strong> {watch('phoneNumber') || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Height/Weight:</strong> {watch('height') || 'Not provided'} cm / {watch('weight') || 'Not provided'} kg
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Gender:</strong> {watch('gender') || 'Not provided'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Time Slot:</strong> {timeSlotOptions.find(slot => slot.value === watch('preferredTimeSlot'))?.label || 'Not selected'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Consent Checkbox */}
            <Grid item xs={12}>
              <FormControl error={!!errors.agreeToUpdates}>
                <Controller
                  name="agreeToUpdates"
                  control={control}
                  rules={{ required: 'You must agree to receive updates to proceed' }}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          I agree to receive updates about classes and events via email and SMS.
                        </Typography>
                      }
                    />
                  )}
                />
                {errors.agreeToUpdates && (
                  <FormHelperText>{errors.agreeToUpdates.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Terms and Privacy */}
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  Your information will be used to provide you with the best yoga experience.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <Person sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Join Our Yoga Community
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your registration to start your wellness journey
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {/* Form Content */}
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
          {renderStepContent(activeStep)}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ px: 3 }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ px: 4 }}
                startIcon={<CheckCircle />}
              >
                {loading ? 'Submitting...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ px: 3 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Divider sx={{ mt: 4, mb: 3 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact us at{' '}
            <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              support@yogastic.com
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserRegistrationForm;
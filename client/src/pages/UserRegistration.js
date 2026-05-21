import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserRegistrationForm from '../components/UserRegistrationForm';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import BackendStatus from '../components/BackendStatus';

const UserRegistration = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      // Calculate age from date of birth if not provided
      let calculatedAge = formData.age;
      if (!calculatedAge && formData.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(formData.dateOfBirth);
        calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
      }

      // Prepare enhanced registration data
      const enhancedRegistrationData = {
        // Basic auth fields
        email: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        phone: formData.phoneNumber,
        
        // Enhanced user profile fields
        fullName: formData.fullName,
        height: formData.height,
        weight: formData.weight,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        preferredTimeSlot: formData.preferredTimeSlot,
        age: calculatedAge || formData.age,
        medicalConditions: formData.medicalConditions,
        agreeToUpdates: formData.agreeToUpdates,
        registrationType: 'enhanced' // Flag to identify this as enhanced registration
      };

      // Call the enhanced registration API
      console.log('Enhanced Registration Data:', enhancedRegistrationData);
      
      try {
        // First try the enhanced registration endpoint
        let result;
        try {
          result = await authAPI.enhancedRegister(enhancedRegistrationData);
          console.log('✅ Registration successful with enhanced endpoint');
        } catch (enhancedError) {
          console.warn('Enhanced registration endpoint failed, trying fallback...', enhancedError.message);
          
          // Check if it's a network error (backend not running)
          if (enhancedError.code === 'ERR_NETWORK' || !enhancedError.response) {
            throw new Error('Backend server is not running. Please start your backend server and try again.');
          }
          
          // Fallback to regular registration
          try {
            result = await registerUser(enhancedRegistrationData);
            if (result && result.success) {
              console.log('✅ Registration successful with fallback endpoint');
            } else {
              console.error('Fallback registration failed:', result?.message);
              throw new Error(result?.message || 'Registration failed with fallback method');
            }
          } catch (fallbackError) {
            console.error('Both registration methods failed:', fallbackError);
            throw new Error(`Registration failed: ${fallbackError.message || fallbackError.response?.data?.message || 'Unknown error'}`);
          }
        }
        
        if (result && result.success) {
          console.log('✅ User registered successfully');
        } else {
          throw new Error(result?.message || 'Registration completed but with unknown status');
        }
        
      } catch (apiError) {
        console.error('Complete registration flow failed:', apiError);
        throw apiError; // Re-throw to be caught by outer try-catch
      }
      
      // Navigate to success page or home
      navigate('/registration-success', { 
        state: { 
          message: 'Registration completed successfully! Welcome to Yogastic.',
          userData: enhancedRegistrationData
        }
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
      <Box sx={{ maxWidth: 'md', mx: 'auto', mb: 3 }}>
        <BackendStatus />
      </Box>
      <UserRegistrationForm 
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </Box>
  );
};

export default UserRegistration;
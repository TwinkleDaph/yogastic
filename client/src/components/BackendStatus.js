import React, { useState, useEffect } from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';
import { Refresh, CheckCircle, Error } from '@mui/icons-material';
import api from '../services/api';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [lastChecked, setLastChecked] = useState(null);

  const checkBackendStatus = async () => {
    setStatus('checking');
    try {
      // Try to hit a simple endpoint to check if backend is running
      await api.get('/auth/status', { timeout: 5000 });
      setStatus('online');
      setLastChecked(new Date());
    } catch (error) {
      console.warn('Backend status check failed:', error.message);
      setStatus('offline');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  if (status === 'online') {
    return null; // Don't show anything if backend is working
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity={status === 'offline' ? 'warning' : 'info'}
        icon={status === 'checking' ? <Refresh /> : <Error />}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={checkBackendStatus}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        }
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {status === 'checking' && 'Checking backend server...'}
          {status === 'offline' && 'Backend Server Offline'}
        </Typography>
        <Typography variant="body2">
          {status === 'checking' && 'Please wait while we check the server connection.'}
          {status === 'offline' && (
            <>
              The backend server is not running. Please start your server with:
              <br />
              <code>cd server && npm run dev</code>
              <br />
              {lastChecked && `Last checked: ${lastChecked.toLocaleTimeString()}`}
            </>
          )}
        </Typography>
      </Alert>
    </Box>
  );
};

export default BackendStatus;
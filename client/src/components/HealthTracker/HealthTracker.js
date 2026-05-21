import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  useTheme
} from '@mui/material';
import {
  FitnessCenter,
  SelfImprovement,
  Bedtime,
  MonitorWeight,
  Add,
  TrendingUp,
  TrendingDown,
  Timeline,
  Close
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const HealthTracker = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [healthData, setHealthData] = useState({
    weight: [],
    yogaSessions: [],
    meditation: [],
    sleep: []
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMetric, setCurrentMetric] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    value: '',
    notes: ''
  });
  
  const [weeklyGoals, setWeeklyGoals] = useState({
    yogaSessions: 3,
    meditationMinutes: 210, // 30 mins * 7 days
    sleepHours: 56 // 8 hours * 7 days
  });

  // Mock data for demonstration
  useEffect(() => {
    // Generate sample data for the last 7 days
    const generateMockData = () => {
      const today = new Date();
      const mockData = {
        weight: [],
        yogaSessions: [],
        meditation: [],
        sleep: []
      };
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Weight data (varying slightly around 70kg)
        mockData.weight.push({
          date: dateStr,
          value: 70 + (Math.random() - 0.5) * 2,
          notes: ''
        });
        
        // Yoga sessions (0-2 per day)
        if (Math.random() > 0.3) {
          mockData.yogaSessions.push({
            date: dateStr,
            value: Math.floor(Math.random() * 90) + 30, // 30-120 minutes
            notes: ['Hatha Yoga', 'Vinyasa Flow', 'Yin Yoga', 'Power Yoga'][Math.floor(Math.random() * 4)]
          });
        }
        
        // Meditation (0-60 minutes per day)
        if (Math.random() > 0.2) {
          mockData.meditation.push({
            date: dateStr,
            value: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
            notes: ''
          });
        }
        
        // Sleep data (6-9 hours)
        mockData.sleep.push({
          date: dateStr,
          value: 6 + Math.random() * 3,
          notes: ''
        });
      }
      
      setHealthData(mockData);
    };
    
    generateMockData();
  }, []);

  const handleOpenDialog = (metric) => {
    setCurrentMetric(metric);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      value: '',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentMetric('');
    setFormData({ date: '', value: '', notes: '' });
  };

  const handleSubmit = () => {
    if (!formData.value || !formData.date) return;
    
    const newEntry = {
      date: formData.date,
      value: parseFloat(formData.value),
      notes: formData.notes
    };
    
    setHealthData(prev => ({
      ...prev,
      [currentMetric]: [...prev[currentMetric], newEntry].sort((a, b) => new Date(a.date) - new Date(b.date))
    }));
    
    handleCloseDialog();
  };

  const getLatestValue = (metric) => {
    const data = healthData[metric];
    return data.length > 0 ? data[data.length - 1] : null;
  };

  const getWeeklyProgress = (metric, goal) => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    
    const weekData = healthData[metric].filter(entry => 
      new Date(entry.date) >= weekStart
    );
    
    const total = weekData.reduce((sum, entry) => sum + entry.value, 0);
    
    if (metric === 'yogaSessions') {
      return Math.min((weekData.length / goal) * 100, 100);
    } else {
      return Math.min((total / goal) * 100, 100);
    }
  };

  const getTrend = (metric) => {
    const data = healthData[metric];
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-3).map(d => d.value);
    const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previous = data.slice(-6, -3).map(d => d.value);
    const prevAvg = previous.length > 0 ? previous.reduce((sum, val) => sum + val, 0) / previous.length : avg;
    
    if (avg > prevAvg * 1.05) return 'up';
    if (avg < prevAvg * 0.95) return 'down';
    return 'stable';
  };

  const HealthMetricCard = ({ 
    title, 
    icon, 
    color, 
    metric, 
    unit, 
    goalValue, 
    isGoalBased = false 
  }) => {
    const latest = getLatestValue(metric);
    const trend = getTrend(metric);
    const weeklyProgress = isGoalBased ? getWeeklyProgress(metric, goalValue) : null;
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: `${color}.light`,
                  color: `${color}.main`,
                  mr: 2
                }}
              >
                {icon}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {latest ? `${latest.value.toFixed(metric === 'weight' ? 1 : 0)} ${unit}` : 'No data'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend === 'up' && <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />}
              {trend === 'down' && <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />}
              {trend === 'stable' && <Timeline sx={{ color: 'grey.500', fontSize: 20 }} />}
              
              <IconButton 
                size="small" 
                onClick={() => handleOpenDialog(metric)}
                sx={{ color: `${color}.main` }}
              >
                <Add />
              </IconButton>
            </Box>
          </Box>
          
          {isGoalBased && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Weekly Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {weeklyProgress.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={weeklyProgress} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: `${color}.main`
                  }
                }}
              />
            </Box>
          )}
          
          {latest && latest.notes && (
            <Chip 
              label={latest.notes} 
              size="small" 
              variant="outlined" 
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  const getDialogTitle = () => {
    const titles = {
      weight: 'Log Weight',
      yogaSessions: 'Log Yoga Session',
      meditation: 'Log Meditation',
      sleep: 'Log Sleep'
    };
    return titles[currentMetric] || 'Add Entry';
  };

  const getInputLabel = () => {
    const labels = {
      weight: 'Weight (kg)',
      yogaSessions: 'Duration (minutes)',
      meditation: 'Duration (minutes)',
      sleep: 'Hours'
    };
    return labels[currentMetric] || 'Value';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
          Health Tracker
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <HealthMetricCard
            title="Weight"
            icon={<MonitorWeight />}
            color="info"
            metric="weight"
            unit="kg"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <HealthMetricCard
            title="Yoga Sessions"
            icon={<SelfImprovement />}
            color="primary"
            metric="yogaSessions"
            unit="min"
            goalValue={weeklyGoals.yogaSessions}
            isGoalBased
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <HealthMetricCard
            title="Meditation"
            icon={<SelfImprovement />}
            color="secondary"
            metric="meditation"
            unit="min"
            goalValue={weeklyGoals.meditationMinutes}
            isGoalBased
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <HealthMetricCard
            title="Sleep"
            icon={<Bedtime />}
            color="success"
            metric="sleep"
            unit="hrs"
            goalValue={weeklyGoals.sleepHours}
            isGoalBased
          />
        </Grid>
      </Grid>

      {/* Add Entry Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {getDialogTitle()}
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={getInputLabel()}
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                inputProps={{ 
                  step: currentMetric === 'weight' ? '0.1' : '1',
                  min: '0'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (optional)"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={
                  currentMetric === 'yogaSessions' ? 'e.g., Hatha Yoga, Vinyasa Flow' :
                  currentMetric === 'meditation' ? 'e.g., Morning meditation, Breathing exercises' :
                  'Optional notes about this entry'
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.value || !formData.date}
          >
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthTracker;
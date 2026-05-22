import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Preview as PreviewIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
  Schedule,
  Public,
  Lock,
  Category,
  Label,
  CheckCircle,
  Cancel,
  Upload
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const quillRef = useRef();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: null,
    categories: [],
    tags: [],
    status: 'draft',
    visibility: 'public',
    publishDate: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [wordCount, setWordCount] = useState(0);
  
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (formData.title.trim() || formData.content.trim()) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [formData]);

  // Generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  // Update word count
  useEffect(() => {
    const text = formData.content.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
  }, [formData.content]);

  // Quill modules and formats
  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'script',
    'code-block', 'direction'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter(id => id !== categoryId)
      : [...formData.categories, categoryId];
    handleInputChange('categories', updatedCategories);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleFeaturedImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleInputChange('featuredImage', file);
      const reader = new FileReader();
      reader.onload = (e) => setFeaturedImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAutoSave = async () => {
    if (!formData.title.trim() && !formData.content.trim()) return;
    
    try {
      setSaving(true);
      setAutoSaveStatus('Saving...');
      
      const saveData = {
        ...formData,
        status: 'draft' // Always save as draft for auto-save
      };
      
      // Mock auto-save (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAutoSaveStatus('Draft saved at ' + new Date().toLocaleTimeString());
      setTimeout(() => setAutoSaveStatus(''), 3000);
    } catch (err) {
      setAutoSaveStatus('Auto-save failed');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setError('');
      
      const saveData = {
        ...formData,
        status: 'draft'
      };
      
      const response = await blogAPI.createBlog(saveData);
      
      if (response.data.success) {
        setSuccess('Draft saved successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }
      
      if (!formData.content.trim()) {
        setError('Content is required');
        return;
      }
      
      const publishData = {
        ...formData,
        status: 'published',
        publishDate: formData.publishDate || new Date().toISOString()
      };
      
      const response = await blogAPI.createBlog(publishData);
      
      if (response.data.success) {
        setSuccess('Blog published successfully!');
        setTimeout(() => {
          navigate('/blogs');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish blog');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (previewMode) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            onClick={() => setPreviewMode(false)}
            startIcon={<EditIcon />}
            variant="outlined"
          >
            Back to Editor
          </Button>
        </Box>
        
        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            {formData.title || 'Untitled Post'}
          </Typography>
          
         
          
          <div 
            dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet...</p>' }}
          />
          
          {formData.tags.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Tags:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">Add New Post</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {autoSaveStatus && (
                  <Typography variant="caption" color="text.secondary">
                    {autoSaveStatus}
                  </Typography>
                )}
                {saving && <CircularProgress size={16} />}
              </Box>
            </Box>

            {/* Title */}
            <TextField
              fullWidth
              placeholder="Enter title here"
              variant="standard"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiInputBase-input': {
                  fontSize: '2rem',
                  fontWeight: 500
                }
              }}
            />

            {/* Permalink */}
            {formData.slug && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Permalink: 
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    /blog/{formData.slug}
                  </Box>
                  <Button 
                    size="small" 
                    onClick={() => {
                      const newSlug = prompt('Edit slug:', formData.slug);
                      if (newSlug !== null) {
                        handleInputChange('slug', newSlug);
                      }
                    }}
                  >
                    Edit
                  </Button>
                </Typography>
              </Box>
            )}

            {/* Rich Text Editor */}
            <Box sx={{ mb: 3 }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Start writing your blog post..."
                style={{ minHeight: '400px' }}
              />
            </Box>

            {/* Word Count */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Word count: {wordCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Draft saved at {new Date().toLocaleTimeString()}
              </Typography>
            </Box>

            {/* Excerpt */}
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Excerpt (Optional)"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                helperText="Brief description of your post"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Publish Panel */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <PublishIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Publish
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
             
              {/* Visibility */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Visibility:</Typography>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                  >
                    <MenuItem value="public">
                      <Public sx={{ fontSize: 16, mr: 1 }} />Public
                    </MenuItem>
                    <MenuItem value="private">
                      <Lock sx={{ fontSize: 16, mr: 1 }} />Private
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Publish Date */}
              {formData.status === 'scheduled' && (
                <TextField
                  fullWidth
                  label="Publish Date"
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange('publishDate', e.target.value)}
                  size="small"
                />
              )}

              <Divider />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveDraft}
                  disabled={loading}
                  fullWidth
                >
                  Save Draft
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={handlePreview}
                  fullWidth
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={handlePublish}
                  disabled={loading || !formData.title.trim()}
                  fullWidth
                >
                  {loading ? 'Publishing...' : 'Publish'}
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Featured Image */}
          <Paper sx={{ p: 2, mb: 2 }}>
            
            
            
            <input
              id="featured-image-input"
              type="file"
              accept="image/*"
              hidden
              onChange={handleFeaturedImageChange}
            />
          </Paper>

          

          

       
        </Grid>
      </Grid>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Container>
  );
};

export default CreateBlog; 
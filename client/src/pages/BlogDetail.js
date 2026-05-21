import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  CalendarMonth,
  ArrowBack,
  Visibility
} from '@mui/icons-material';
import { blogAPI } from '../services/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getBlog(slug);

      if (response.data.success) {
        setBlog(response.data.blog);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.response?.data?.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'yoga': return 'primary';
      case 'meditation': return 'secondary';
      case 'fitness': return 'success';
      case 'nutrition': return 'warning';
      case 'wellness': return 'info';
      case 'lifestyle': return 'default';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading blog...
        </Typography>
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 4 }}>
            {error || 'Blog not found'}
          </Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/blogs')}
          >
            Back to Blogs
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      {blog.featuredImg && (
        <Box
          sx={{
            height: { xs: 300, md: 450 },
            backgroundImage: `url(${blog.featuredImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
            }}
          />
        </Box>
      )}

      {/* Content Section */}
      <Container maxWidth="md" sx={{ mt: { xs: -8, md: -10 }, position: 'relative', pb: 8 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blogs')}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Back to Blogs
        </Button>

        {/* Article Card */}
        <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {/* Meta Info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
              <Chip
                label={blog.category || 'yoga'}
                color={getCategoryColor(blog.category)}
                size="small"
                sx={{ fontWeight: 500 }}
              />
              <Typography variant="body2" color="text.secondary">
                {blog.readTime} min read
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.views || 0} views
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              {blog.title}
            </Typography>

            {/* Author */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Avatar
                src={blog.author?.profilePhoto}
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  bgcolor: 'primary.main',
                  fontSize: '1.25rem'
                }}
              >
                {blog.author?.firstName?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {blog.author?.firstName} {blog.author?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.author?.bio || 'Yoga Enthusiast'}
                </Typography>
              </Box>
            </Box>

            {/* Featured Image (if no hero) */}
            {!blog.featuredImg && null}

            {/* Content */}
            <Box
              sx={{
                '& p': { mb: 2, lineHeight: 1.8 },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  mt: 4,
                  mb: 2,
                  fontWeight: 600
                },
                '& ul, & ol': {
                  pl: 4,
                  mb: 2
                },
                '& li': {
                  mb: 1
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  my: 3
                },
                '& blockquote': {
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 3,
                  py: 1,
                  my: 3,
                  fontStyle: 'italic',
                  color: 'text.secondary'
                },
                '& pre': {
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 2,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  mb: 2
                },
                '& code': {
                  fontFamily: 'monospace',
                  backgroundColor: 'grey.100',
                  px: 0.5,
                  borderRadius: 0.5
                }
              }}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Tags:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {blog.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/blogs?tag=${tag}`)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Author Bio Card */}
        <Card sx={{ mt: 4, borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={blog.author?.profilePhoto}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {blog.author?.firstName?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  About the Author
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {blog.author?.firstName} {blog.author?.lastName}
                </Typography>
                {blog.author?.bio && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {blog.author.bio}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BlogDetail;
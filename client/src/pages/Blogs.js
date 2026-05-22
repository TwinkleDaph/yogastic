import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Pagination,
  useTheme
} from '@mui/material';
import {
  CalendarMonth,
  Visibility
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';

const Blogs = () => {
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getBlogs({ page: pageNum, limit: 6 });

      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError('Failed to load blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.response?.data?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (loading && blogs.length === 0) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading blogs...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 600, mb: 3 }}>
            Yoga & Wellness Blog
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Discover insights, tips, and inspiration for your wellness journey
          </Typography>
        </Container>
      </Box>

      {/* Blogs Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {blogs.length === 0 && !loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Visibility sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No blogs published yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Check back soon for new content!
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={4}>
                {blogs.map((blog) => (
                  <Grid item xs={12} md={6} lg={4} key={blog._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[8]
                        }
                      }}
                    >
                      {blog.featuredImg && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={blog.featuredImg}
                          alt={blog.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip
                            label={blog.category || 'yoga'}
                            color={getCategoryColor(blog.category)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {blog.readTime} min read
                          </Typography>
                        </Box>

                        <Typography
                          variant="h6"
                          component={Link}
                          to={`/blog/${blog.slug}`}
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            textDecoration: 'none',
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          {blog.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 3,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: 60
                          }}
                        >
                          {blog.excerpt}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={blog.author?.profilePhoto}
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                bgcolor: theme.palette.primary.main,
                                fontSize: '0.875rem'
                              }}
                            >
                              {blog.author?.firstName?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                {blog.author?.firstName} {blog.author?.lastName}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarMonth sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(blog.publishedAt || blog.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {blog.views || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Blogs;
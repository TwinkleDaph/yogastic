import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Additional detailed logging for 400 errors
    if (error.response?.status === 400) {
      console.error('400 Bad Request Details:');
      console.error('Response Data:', error.response?.data);
      
      // Show specific validation errors if present
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        console.error('Validation Errors:');
        error.response.data.errors.forEach((err, index) => {
          console.error(`  ${index + 1}.`, err);
        });
      }
      
      console.error('Request Headers:', error.config?.headers);
      
      // Log FormData contents if present
      if (error.config?.data instanceof FormData) {
        console.error('FormData contents:');
        for (let [key, value] of error.config.data.entries()) {
          console.error(`  ${key}:`, value);
        }
      } else {
        console.error('Request Data:', error.config?.data);
      }
    }
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Don't redirect if we're already on login page or trying to login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors (backend not running)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('Backend server appears to be offline');
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register new user
  register: (userData) => {
    console.log('Register called with:', userData);
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined && userData[key] !== '') {
        formData.append(key, userData[key]);
      }
    });
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    return api.post('/auth/register', formData);
  },
  
  adminCreateUser: (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach(key => {
    if (userData[key] !== null && userData[key] !== undefined && userData[key] !== '') {
      formData.append(key, userData[key]);
    }
  });
  return api.post('/auth/admin/user', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
},

  // Login user
  login: (credentials) => api.post('/auth/login', credentials),

  // Logout user
  logout: () => api.post('/auth/logout'),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),

  // Check auth status
  checkAuthStatus: () => api.get('/auth/status'),

  // Update profile
  updateProfile: (profileData) => {
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });
    return api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Change password
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),

  // Enhanced user registration (fallback to regular register with extra data)
  enhancedRegister: (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        if (key === 'dateOfBirth' && userData[key] instanceof Date) {
          formData.append(key, userData[key].toISOString());
        } else {
          formData.append(key, userData[key]);
        }
      }
    });
    
    // Try enhanced endpoint first, fallback to regular register
    return api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).catch(error => {
      // If enhanced registration fails, the calling code will handle fallback
      throw error;
    });
  }
};

// Blog API calls
export const blogAPI = {
  // Get all blogs
  getBlogs: (params = {}) => api.get('/blogs', { params }),

  // Search blogs
  searchBlogs: (query, params = {}) => api.get('/blogs/search', { 
    params: { q: query, ...params } 
  }),

  // Get single blog by slug
  getBlog: (slug) => api.get(`/blogs/${slug}`),

  // Get user's blogs
  getMyBlogs: (params = {}) => api.get('/blogs/my-blogs', { params }),

  // Create new blog
  createBlog: (blogData) => {
    const formData = new FormData();
    Object.keys(blogData).forEach(key => {
      if (key === 'tags' && Array.isArray(blogData[key])) {
        formData.append('tags', JSON.stringify(blogData[key]));
      } else if (blogData[key] !== null && blogData[key] !== undefined) {
        formData.append(key, blogData[key]);
      }
    });
    return api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Update blog
  updateBlog: (id, blogData) => {
    const formData = new FormData();
    Object.keys(blogData).forEach(key => {
      if (key === 'tags' && Array.isArray(blogData[key])) {
        blogData[key].forEach(tag => formData.append('tags[]', tag));
      } else if (blogData[key] !== null && blogData[key] !== undefined) {
        formData.append(key, blogData[key]);
      }
    });
    return api.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Delete blog
  deleteBlog: (id) => api.delete(`/blogs/${id}`),

  // Like/unlike blog
  likeBlog: (id) => api.post(`/blogs/${id}/like`),

  // Get blog for editing
  getBlogForEdit: (id) => api.get(`/blogs/edit/${id}`),

  // Get blog categories
  getCategories: () => api.get('/blogs/meta/categories')
};

// User API calls
export const userAPI = {
  // Get all users (admin only)
  getUsers: (params = {}) => api.get('/users', { params }),

  // Get user by ID
  getUser: (id) => api.get(`/users/${id}`),

  // Get user statistics (admin only)
  getUserStats: () => api.get('/users/stats'),

  // Update user role (admin only)
  updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, { role }),

  // Delete user (admin only)
  deleteUser: (userId) => api.delete(`/users/${userId}`)
};

// Package API calls
export const packageAPI = {
  // Get all packages
  getPackages: (params = {}) => api.get('/packages', { params }),

  // Get single package
  getPackage: (id) => api.get(`/packages/${id}`),

  // Create package (admin)
  createPackage: (packageData) => {
    console.log('Creating package with data:', packageData);
    return api.post('/packages', packageData);
  },

  // Update package (admin)
  updatePackage: (id, packageData) => {
    console.log('Updating package:', id, packageData);
    return api.put(`/packages/${id}`, packageData);
  },

  // Delete package (admin)
  deletePackage: (id) => api.delete(`/packages/${id}`),

  // Get package stats
  getPackageStats: () => api.get('/packages/stats')
};

// Transaction API calls
export const transactionAPI = {
  // Create transaction (purchase package)
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),

  // Get my transactions/packages
  getMyTransactions: () => api.get('/transactions/my-packages'),

  // Get active packages
  getActivePackages: () => api.get('/transactions/active'),

  // Get user's transactions (admin)
  getUserTransactions: (userId) => api.get(`/transactions/user/${userId}`),

  // Get all transactions (admin)
  getAllTransactions: (params = {}) => api.get('/transactions', { params }),

  // Get transaction by ID
  getTransaction: (id) => api.get(`/transactions/${id}`),

  // Get transaction stats (admin)
  getTransactionStats: () => api.get('/transactions/stats'),

  // Refund transaction (admin)
  refundTransaction: (id) => api.put(`/transactions/${id}/refund`)
};

export default api; 
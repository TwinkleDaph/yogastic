import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ExploreYoga from './pages/ExploreYoga';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Packages from './pages/Packages';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/explore-yoga" element={<ExploreYoga />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/packages" element={<Packages />} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
                {/* <Route path="/registration-demo" element={<RegistrationDemo />} /> */}
                {/* <Route path="/user-registration" element={<UserRegistration />} /> */}
                {/* <Route path="/registration-success" element={<RegistrationSuccess />} /> */}
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/create-blog" element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                } />
                <Route path="/edit-blog/:id" element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

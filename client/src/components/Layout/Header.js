import React, { useState} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  ExitToApp,
  Create,
  Dashboard,
  AdminPanelSettings
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleUserMenuOpen = () => {
    // setAnchorEl(buttonRef.current);
    setAnchorEl(true)
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/explore-yoga' },
    { label: 'Packages', path: '/packages' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
      <Box
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 2
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 2C14.5 3.5 13.5 5.5 13.5 8C13.5 10.5 14.5 12.5 16 14C17.5 12.5 18.5 10.5 18.5 8C18.5 5.5 17.5 3.5 16 2Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M22 8C20.5 9.5 19.5 11.5 19.5 14C19.5 16.5 20.5 18.5 22 20C23.5 18.5 24.5 16.5 24.5 14C24.5 11.5 23.5 9.5 22 8Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M10 8C8.5 9.5 7.5 11.5 7.5 14C7.5 16.5 8.5 18.5 10 20C11.5 18.5 12.5 16.5 12.5 14C12.5 11.5 11.5 9.5 10 8Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M16 16C14.5 17.5 13.5 19.5 13.5 22C13.5 24.5 14.5 26.5 16 28C17.5 26.5 18.5 24.5 18.5 22C18.5 19.5 17.5 17.5 16 16Z"
            fill={theme.palette.secondary.main}
          />
        </svg>
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
          fontSize: { xs: '1.5rem', sm: '1.75rem' }
        }}
      >
        Yogastic
      </Typography>
    </Box>
  );

  const NavigationItems = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => (
        <Button
          key={item.label}
          component={Link}
          to={item.path}
          onClick={mobile ? handleMobileMenuToggle : undefined}
          sx={{
            color: isActiveRoute(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
            fontWeight: isActiveRoute(item.path) ? 600 : 500,
            mx: mobile ? 0 : 1,
            my: mobile ? 0.5 : 0,
            justifyContent: mobile ? 'flex-start' : 'center',
            borderBottom: !mobile && isActiveRoute(item.path) ? `2px solid ${theme.palette.primary.main}` : 'none',
            borderRadius: mobile ? 1 : 0,
            '&:hover': {
              backgroundColor: mobile ? theme.palette.action.hover : 'transparent',
              color: theme.palette.primary.main
            }
          }}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  const menuId = 'primary-user-menu';
  const buttonId = 'primary-user-button';

  const AuthButtons = () => {
    if (isAuthenticated) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
          <IconButton
         
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={handleUserMenuOpen}
            sx={{ p: 0 }}
          >
            {user?.profilePhoto ? (
              <Avatar
                src={user.profilePhoto}
                alt={user.fullName || user.firstName}
                sx={{ width: 40, height: 40 }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main
                }}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            )}
          </IconButton>
          <Menu
        
     id={menuId}
  open={open}
  onClose={handleUserMenuClose}
  anchorReference="anchorPosition"
  anchorPosition={{
    top: 70,
    left: window.innerWidth - 260,
  }}
  PaperProps={{
    sx: {
      width: 250,
    },
  }}
>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.fullName || `${user?.firstName} ${user?.lastName}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => {  navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');  handleUserMenuClose(); }}>
              <Dashboard sx={{ mr: 1, fontSize: 20 }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
              <Person sx={{ mr: 1, fontSize: 20 }} />
              Profile
            </MenuItem>
            {user?.role === 'admin' && (
              <>
                <MenuItem onClick={() => { navigate('/create-blog'); handleUserMenuClose(); }}>
                  <Create sx={{ mr: 1, fontSize: 20 }} />
                  Create Blog
                </MenuItem>
                <MenuItem onClick={() => { navigate('/admin/dashboard'); handleUserMenuClose(); }}>
                  <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} />
                  Admin Dashboard
                </MenuItem>
              </>
            )}
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
              <ExitToApp sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          size="medium"
          sx={{ minWidth: 80 }}
        >
          Login
        </Button>
      </Box>
    );
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ display: 'flex',
    alignItems: 'center',
    py: 1 }}>
          <Logo />
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3,   ml: 'auto',
      mr: 2 }}>
              <NavigationItems />
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            {!isMobile && <AuthButtons />}
            
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMobileMenuToggle}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: theme.palette.background.paper
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Logo />
        </Box>
        <Divider />
        <List sx={{ px: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <Button
                component={Link}
                to={item.path}
                onClick={handleMobileMenuToggle}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  color: isActiveRoute(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                  fontWeight: isActiveRoute(item.path) ? 600 : 500,
                  backgroundColor: isActiveRoute(item.path) ? theme.palette.action.selected : 'transparent'
                }}
              >
                {item.label}
              </Button>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ px: 2 }}>
          <AuthButtons />
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
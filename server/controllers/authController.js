const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { uploadProfile, handleMulterError, getFileUrl, deleteFile } = require('../config/multer');
const path = require('path');

require('../config/passport');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Authentication required' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ success: false, message: 'Admin access required' });
};

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const register = async (req, res) => {
  try {
    console.log('Registration body:', req.body);
    console.log('File:', req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, phone, bio } = req.body;

    console.log('Creating user with:', { email, firstName, lastName, phone, bio });

    const existingUser = await User.findByEmail(email);
    console.log('Existing user check:', existingUser);
    if (existingUser) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const userData = { email, firstName, lastName, phone, bio };
    if (req.file) userData.profilePhoto = req.file.filename;

    console.log('User data:', userData);

    const user = new User(userData);
    console.log('User instance created, calling register...');
    await User.register(user, password);
    console.log('User registered successfully');

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Registration successful but login failed'
        });
      }

      const profilePhotoUrl = req.file ? getFileUrl(req, req.file.filename, 'profiles') : '';

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          ...user.getPublicProfile(),
          profilePhoto: profilePhotoUrl
        }
      });
    });

  } catch (error) {
    if (req.file) await deleteFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};
const adminCreateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const { email, password, firstName, lastName, phone, bio, role } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    const userData = { email, firstName, lastName, phone, bio };
    if (role) userData.role = role;
    if (req.file) userData.profilePhoto = req.file.filename;
    const user = new User(userData);
    await User.register(user, password);
    const profilePhotoUrl = req.file ? getFileUrl(req, req.file.filename, 'profiles') : '';
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        ...user.getPublicProfile(),
        profilePhoto: profilePhotoUrl
      }
    });
  } catch (error) {
    if (req.file) await deleteFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'User creation failed',
      error: error.message
    });
  }
};

const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: err.message
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Invalid credentials'
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Login failed'
        });
      }

      const profilePhotoUrl = user.profilePhoto ? getFileUrl(req, user.profilePhoto, 'profiles') : '';

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          ...user.getPublicProfile(),
          profilePhoto: profilePhotoUrl
        }
      });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Session destruction failed' });
      }

      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logout successful' });
    });
  });
};

const getMe = (req, res) => {
  const profilePhotoUrl = req.user.profilePhoto ? getFileUrl(req, req.user.profilePhoto, 'profiles') : '';

  res.json({
    success: true,
    user: {
      ...req.user.getPublicProfile(),
      profilePhoto: profilePhotoUrl
    }
  });
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    const user = req.user;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;

    if (req.file) {
      if (user.profilePhoto) {
        const oldPhotoPath = path.join(__dirname, '../uploads/profiles', user.profilePhoto);
        await deleteFile(oldPhotoPath);
      }
      user.profilePhoto = req.file.filename;
    }

    await user.save();

    const profilePhotoUrl = user.profilePhoto ? getFileUrl(req, user.profilePhoto, 'profiles') : '';

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...user.getPublicProfile(),
        profilePhoto: profilePhotoUrl
      }
    });

  } catch (error) {
    if (req.file) await deleteFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      error: error.message
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    await user.changePassword(currentPassword, newPassword);

    res.json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Password change failed' });
  }
};

const getStatus = (req, res) => {
  if (req.isAuthenticated()) {
    const profilePhotoUrl = req.user.profilePhoto ? getFileUrl(req, req.user.profilePhoto, 'profiles') : '';

    res.json({
      success: true,
      isAuthenticated: true,
      user: {
        ...req.user.getPublicProfile(),
        profilePhoto: profilePhotoUrl
      }
    });
  } else {
    res.json({ success: true, isAuthenticated: false, user: null });
  }
};

module.exports = {
  isLoggedIn,
  isAdmin,
  registerValidation,
  loginValidation,
  register,
  adminCreateUser,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  getStatus
};
const express = require('express');
const router = express.Router();
const { uploadProfile, handleMulterError } = require('../config/multer');
const {
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
} = require('../controllers/authController');

router.post('/register', isLoggedIn,isAdmin,uploadProfile, handleMulterError, registerValidation, register);
router.post('/admin/user', isLoggedIn, isAdmin, uploadProfile, handleMulterError, registerValidation, adminCreateUser);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', isLoggedIn, getMe);
router.put('/profile', isLoggedIn, uploadProfile, handleMulterError, updateProfile);
router.put('/change-password', isLoggedIn, changePassword);
router.get('/status', getStatus);

module.exports = router;
const User = require('../models/User');
const { getFileUrl } = require('../config/multer');

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

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('firstName lastName profilePhoto bio role createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments({ isActive: true });

    const usersWithUrls = users.map(user => {
      const userData = user.getPublicProfile();
      if (userData.profilePhoto) {
        userData.profilePhoto = getFileUrl(req, userData.profilePhoto, 'profiles');
      }
      return userData;
    });

    res.json({
      success: true,
      users: usersWithUrls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName profilePhoto bio role createdAt');

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = user.getPublicProfile();
    if (userData.profilePhoto) {
      userData.profilePhoto = getFileUrl(req, userData.profilePhoto, 'profiles');
    }

    res.json({ success: true, user: userData });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

module.exports = {
  isLoggedIn,
  isAdmin,
  getAllUsers,
  getUserById
};
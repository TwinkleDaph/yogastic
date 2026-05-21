const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../controllers/authController');
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageStats
} = require('../controllers/packageController');

router.get('/', getAllPackages);
router.get('/stats', getPackageStats);
router.get('/:id', getPackageById);

router.post('/', isLoggedIn, isAdmin, createPackage);
router.put('/:id', isLoggedIn, isAdmin, updatePackage);
router.delete('/:id', isLoggedIn, isAdmin, deletePackage);

module.exports = router;
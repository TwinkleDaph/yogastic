const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../controllers/authController');
const { getAllUsers, getUserById } = require('../controllers/userController');

router.get('/', isLoggedIn, isAdmin, getAllUsers);
router.get('/:id', isLoggedIn, getUserById);

module.exports = router;
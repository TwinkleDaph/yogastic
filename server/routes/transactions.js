const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../controllers/authController');
const {
  createTransaction,
  getMyTransactions,
  getActivePackages,
  getTransactionById,
  getAllTransactions,
  getUserTransactions,
  getTransactionStats,
  refundTransaction
} = require('../controllers/transactionController');

router.post('/', isLoggedIn, isAdmin,createTransaction);

router.get('/my-packages', isLoggedIn, getMyTransactions);
router.get('/active', isLoggedIn, getActivePackages);
router.get('/user/:userId', isLoggedIn, isAdmin, getUserTransactions);

router.get('/', isLoggedIn, isAdmin, getAllTransactions);
router.get('/stats', isLoggedIn, isAdmin, getTransactionStats);

router.get('/:id', isLoggedIn, getTransactionById);
router.put('/:id', isLoggedIn, isAdmin,require('../controllers/transactionController').updateTransaction);;

module.exports = router;
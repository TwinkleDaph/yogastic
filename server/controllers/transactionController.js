const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Package = require('../models/Package');

const transactionController = {
  createTransaction: async (req, res) => {
    try {
      console.log('=== CREATE TRANSACTION ===');
      console.log('User:', req.user?._id);
      console.log('Body:', req.body);

      const { packageId, userId, paymentMethod, paymentStatus, paymentDate, notes } = req.body;

      if (!packageId) {
        return res.status(400).json({
          success: false,
          message: 'Package ID is required'
        });
      }

      // Only admins can create transactions for package subscriptions
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can subscribe to packages'
        });
      }

      const targetUserId = userId || req.user._id;
      console.log('targetUserId:', targetUserId);
      console.log('targetUserId type:', typeof targetUserId);

      if (!targetUserId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Convert to ObjectId if it's a string
      let targetUserObjectId = targetUserId;
      if (typeof targetUserId === 'string') {
        targetUserObjectId = new mongoose.Types.ObjectId(targetUserId);
        console.log('Converted targetUserId to ObjectId:', targetUserObjectId);
      }

      const pkg = await Package.findById(packageId);
      if (!pkg) {
        console.log('Package not found:', packageId);
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      console.log('Package found:', pkg.name);

      if (!pkg.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Package is not available'
        });
      }

      const existingTransaction = await Transaction.findOne({
        userId: targetUserObjectId,
        packageId: packageId,
        paymentStatus: 'completed',
        endDate: { $gte: new Date() }
      });

      if (existingTransaction) {
        console.log('Existing transaction found:', existingTransaction._id);
        return res.status(400).json({
          success: false,
          message: 'You already have an active subscription for this package'
        });
      }

      const startDate = new Date();
      let endDate;

      if (pkg.durationUnit === 'days') {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + pkg.duration);
      } else if (pkg.durationUnit === 'weeks') {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (pkg.duration * 7));
      } else if (pkg.durationUnit === 'months') {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + pkg.duration);
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + pkg.duration);
      }

      const originalPrice = pkg.price;
      const discountApplied = pkg.discount > 0 ? pkg.price * (pkg.discount / 100) : 0;
      let paymentAmount = originalPrice - discountApplied;
      if (paymentAmount < 0) paymentAmount = 0;

      const paymentMethodToUse = (paymentMethod === 'admin-assigned' || !paymentMethod) ? 'card' : paymentMethod;

      const transactionData = {
        userId: targetUserObjectId,
        packageId: packageId,
        startDate,
        endDate,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        paymentAmount,
        originalPrice,
        discountApplied,
        paymentMethod: paymentMethodToUse,
        paymentStatus: paymentStatus || 'completed',
        notes: notes || ''
      };

      console.log('Creating transaction with:', transactionData);
      console.log('userId:', targetUserId, 'packageId:', packageId);

      const transaction = new Transaction(transactionData);

      console.log('Saving transaction:', {
        userId: transaction.userId,
        packageId: transaction.packageId,
        startDate: transaction.startDate,
        endDate: transaction.endDate,
        paymentStatus: transaction.paymentStatus
      });
      await transaction.save();
      console.log('Transaction saved successfully with _id:', transaction._id);

      const savedTransaction = await Transaction.findById(transaction._id);
      console.log('Verified saved transaction:', {
        _id: savedTransaction._id,
        userId: savedTransaction.userId,
        packageId: savedTransaction.packageId
      });
      console.log('Transaction saved with ID:', transaction._id);
      
      const populatedTransaction = await Transaction.findById(transaction._id)
        .populate('packageId', 'name description duration durationUnit category level');
      
      res.status(201).json({
        success: true,
        message: 'Payment successful! Your package is now active.',
        transaction: populatedTransaction
      });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process payment'
      });
    }
  },

  getMyTransactions: async (req, res) => {
    try {
      console.log('getMyTransactions called for user:', req.user?._id);
      console.log('User ID type:', typeof req.user?._id);
      console.log('User object:', req.user);
      
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      let userIdObj;
      try {
        userIdObj = new mongoose.Types.ObjectId(req.user._id);
        console.log('Converted userId:', userIdObj);
      } catch (e) {
        console.error('Error converting userId:', e);
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }
      
      const transactions = await Transaction.find({ userId: userIdObj })
        .populate('packageId', 'name description duration durationUnit price category level features')
        .sort({ createdAt: -1 });
      
      console.log('Found transactions count:', transactions.length);
      transactions.forEach((t, i) => {
        console.log(`Transaction ${i+1}:`, {
          _id: t._id,
          userId: t.userId,
          packageId: t.packageId,
          paymentStatus: t.paymentStatus,
          endDate: t.endDate
        });
      });

      const activeTransactions = transactions.filter(t => t.isActive());
      const pastTransactions = transactions.filter(t => !t.isActive());

      console.log('Filtered active transactions:', activeTransactions.length);
      activeTransactions.forEach((t, i) => {
        console.log(`Active Transaction ${i+1}:`, {
          _id: t._id,
          userId: t.userId,
          packageId: t.packageId,
          packageName: t.packageId?.name,
          paymentStatus: t.paymentStatus,
          endDate: t.endDate,
          isActive: t.isActive()
        });
      });

      res.json({
        success: true,
        activeTransactions,
        pastTransactions,
        allTransactions: transactions
      });
    } catch (error) {
      console.error('Get my transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions'
      });
    }
  },

  getActivePackages: async (req, res) => {
    try {
      console.log('getActivePackages called for user:', req.user._id);
      const activeTransactions = await Transaction.findActiveByUser(req.user._id);
      console.log('getActivePackages found:', activeTransactions.length, 'transactions');
      activeTransactions.forEach((t, i) => {
        console.log(`Active TXN ${i+1}:`, {
          _id: t._id,
          userId: t.userId,
          packageId: t.packageId,
          packageName: t.packageId?.name,
          endDate: t.endDate
        });
      });
      
      res.json({
        success: true,
        count: activeTransactions.length,
        packages: activeTransactions
      });
    } catch (error) {
      console.error('Get active packages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch active packages'
      });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.user._id
      }).populate('packageId');
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
      
      res.json({
        success: true,
        transaction
      });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transaction'
      });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, packageId, startDate, endDate } = req.query;

      let query = {};

      if (status) query.paymentStatus = status;
      if (packageId) query.packageId = packageId;

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('packageId', 'name duration price discount durationUnit')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Transaction.countDocuments(query);

      res.json({
        success: true,
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions'
      });
    }
  },

  getUserTransactions: async (req, res) => {
    try {
      const mongoose = require('mongoose');

      if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
      }

      const userId = new mongoose.Types.ObjectId(req.params.userId);

      const transactions = await Transaction.find({ userId })
        .populate('packageId', 'name duration price discount durationUnit')
        .sort({ createdAt: -1 });

      console.log('Found transactions for user', req.params.userId, ':', transactions.length);

      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      console.error('Get user transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user transactions',
        error: error.message
      });
    }
  },

  getTransactionStats: async (req, res) => {
    try {
      const totalRevenue = await Transaction.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
      ]);
      
      const monthlyRevenue = await Transaction.aggregate([
        { $match: { paymentStatus: 'completed' } },
        {
          $group: {
            _id: { $month: '$paymentDate' },
            revenue: { $sum: '$paymentAmount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      const totalTransactions = await Transaction.countDocuments({ paymentStatus: 'completed' });
      
      res.json({
        success: true,
        stats: {
          totalRevenue: totalRevenue[0]?.total || 0,
          totalTransactions,
          monthlyRevenue
        }
      });
    } catch (error) {
      console.error('Get transaction stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stats'
      });
    }
  },

  refundTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.user._id
      });
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
      
      if (transaction.paymentStatus !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Transaction cannot be refunded'
        });
      }
      
      transaction.paymentStatus = 'refunded';
      await transaction.save();
      
      res.json({
        success: true,
        message: 'Transaction refunded successfully',
transaction
      });
    } catch (error) {
      console.error('Refund transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refund transaction'
      });
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const { paymentStatus, paymentMethod, paymentDate, notes } = req.body;

      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      if (paymentStatus) transaction.paymentStatus = paymentStatus;
      if (paymentMethod) transaction.paymentMethod = paymentMethod;
      if (paymentDate) transaction.paymentDate = new Date(paymentDate);
      if (notes !== undefined) transaction.notes = notes;

      await transaction.save();

      const populatedTransaction = await Transaction.findById(transaction._id)
        .populate('packageId', 'name description duration durationUnit category level');

      res.json({
        success: true,
        message: 'Transaction updated successfully',
        transaction: populatedTransaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update transaction'
      });
    }
  },

  getUserTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find({ userId: req.params.userId })
        .populate('packageId', 'name duration price discount durationUnit')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      console.error('Get user transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user transactions',
        error: error.message
      });
    }
  }
};

module.exports = transactionController;
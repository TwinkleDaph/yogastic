const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cash', 'other'],
    default: 'card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

transactionSchema.methods.isActive = function() {
  const now = new Date();
  return this.paymentStatus === 'completed' && now <= this.endDate;
};

transactionSchema.methods.getRemainingDays = function() {
  if (!this.isActive()) return 0;
  const now = new Date();
  const diff = this.endDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

transactionSchema.statics.findByUser = function(userId) {
  return this.find({ userId })
    .populate('packageId')
    .sort({ createdAt: -1 });
};

transactionSchema.statics.findActiveByUser = function(userId) {
  const mongoose = require('mongoose');
  let userIdObj = userId;
  if (typeof userId === 'string') {
    userIdObj = new mongoose.Types.ObjectId(userId);
  }
  const now = new Date();
  return this.find({
    userId: userIdObj,
    paymentStatus: 'completed',
    endDate: { $gte: now }
  }).populate('packageId').sort({ endDate: 1 });
};

transactionSchema.index({ userId: 1 });
transactionSchema.index({ packageId: 1 });
transactionSchema.index({ paymentStatus: 1 });
transactionSchema.index({ endDate: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
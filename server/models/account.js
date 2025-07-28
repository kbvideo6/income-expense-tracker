// models/Account.js

const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  Name: {
    type: String,
    required: true,
    trim: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'checking', 'credit', 'cash', 'investment'],
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR',
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  transactions:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Transaction',
  }],
});

// Update the updatedAt field before saving
AccountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Account', AccountSchema);

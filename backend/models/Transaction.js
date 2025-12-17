const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['expense', 'income', 'transfer'],
    default: 'expense'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'transfer', 'other'],
    default: 'other'
  },
  tags: {
    type: [String]
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, { 
  timestamps: true
});

// Common indexes for querying expenses
transactionSchema.index({ date: -1}); // sort by date descending
transactionSchema.index({ category: 1 }); // filter by category
transactionSchema.index({ description: 1, amount: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
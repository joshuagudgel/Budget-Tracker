const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'transport', 'utilities', 'entertainment', 'health', 'other']
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'other'],
    default: 'cash'
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
expenseSchema.index({ date: -1}); // sort by date descending
expenseSchema.index({ category: 1 }); // filter by category

module.exports = mongoose.model('Expense', expenseSchema);
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {type: Number,
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
expenseSchema.index({ date: -1}); // sort by date descending
expenseSchema.index({ category: 1 }); // filter by category
expenseSchema.index({ description: 1, amount: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
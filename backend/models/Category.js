const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color']
  },
  budgetLimit: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
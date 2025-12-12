const Expense = require('../models/Expense');

// Create expense
const create = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        message: errors 
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all expenses
const getAll = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get expense by ID
const getById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ 
        error: 'Expense not found',
        message: `No expense found with ID: ${req.params.id}`
      });
    }
    return res.status(200).json(expense);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID format',
        message: 'Please provide a valid expense ID'
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update expense by ID
const updateById = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        error: "Expense not found",
        message: `No expense found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: errors
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID format',
        message: 'Please provide a valid expense ID'
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete expense by ID
const deleteById = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({
        message: `No expense found with ID: ${req.params.id}`,
        error: 'Expense not found'
      });
    }

    return res.status(200).json({
      message: 'Expense deleted successfully',
      expense: deletedExpense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: errors
      });
    }
    return res.status(500).json({ error: 'Internal Server Error'});
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById
};
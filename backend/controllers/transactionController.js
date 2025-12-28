const Transaction = require('../models/Transaction');

// Create transaction
const create = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
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

// Create transactions
const createMany = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Request body must be a non-empty array of transactions'
      });
    }

    const savedTransactions = await Transaction.insertMany(req.body, {ordered: false});
    return res.status(201).json({
      message: 'Transactions created successfully',
      transactions: savedTransactions
    });
  } catch (error) {
    console.error(`Failed to create transactions`);
  }
}

// Get all transactions
const getAll = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get transaction by ID
const getById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        message: `No transaction found with ID: ${req.params.id}`
      });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID format',
        message: 'Please provide a valid transaction ID'
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update transaction by ID
const updateById = async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        error: "Transaction not found",
        message: `No transaction found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
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
        message: 'Please provide a valid transaction ID'
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete transaction by ID
const deleteById = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({
        message: `No transaction found with ID: ${req.params.id}`,
        error: 'Transaction not found'
      });
    }

    return res.status(200).json({
      message: 'Transaction deleted successfully',
      transaction: deletedTransaction
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
  createMany,
  getAll,
  getById,
  updateById,
  deleteById
};
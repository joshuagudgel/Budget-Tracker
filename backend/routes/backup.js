const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Category = require('../models/Category');

// backup
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    const categories = await Category.find();

    return res.status(200).json({
      expenses, 
      categories
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


module.exports = router;
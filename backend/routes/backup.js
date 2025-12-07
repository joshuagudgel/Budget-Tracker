const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const fs = require('fs').promises;
const path = require('path');

function cleanData(data, type) {
  if (type === 'expense') {
    return data.map(exp => ({
      amount: exp.amount,
      description: exp.description,
      date: exp.date,
      category: exp.category,
      paymentMethod: exp.paymentMethod
    }));
  } else if (type === 'category') {
    return data.map(cat => ({
      name: cat.name,
      displayName: cat.displayName,
      color: cat.color,
      budgetLimit: cat.budgetLimit
    }));
  }
  return data;
}

// backup
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    const categories = await Category.find();

    const cleanExpenses = cleanData(expenses, 'expense');
    const cleanCategories = cleanData(categories, 'category');

    return res.status(200).json({
      expenses: cleanExpenses, 
      categories: cleanCategories
    });
  } catch (error) {
    console.error('Backup error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// export
router.post('/export', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({date: -1});
    const categories = await Category.find();

    const cleanExpenses = cleanData(expenses, 'expense');
    const cleanCategories = cleanData(categories, 'category');

    const backupData = {
      expenses: cleanExpenses,
      categories: cleanCategories
    };

    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `budget-backup-${timestamp}.json`;

    // ensure directory exists
    const backupDir = path.join(process.cwd(), 'backups');
    await fs.mkdir(backupDir, {recursive: true});

    const filePath = path.join(backupDir, filename);
    await fs.writeFile(filePath, JSON.stringify(backupData, null, 2));

    return res.status(200).json({
      message: 'Backup created successfully',
      filename: filename,
      path: filePath
    });
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({
      error: 'Failed to create backup file'
    });
  }
});

// --------------------

module.exports = router;
// for testing
module.exports.cleanData = cleanData;
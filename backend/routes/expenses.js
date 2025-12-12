const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {fileSize: 5 * 1024 * 1024} // 5 MB
});

// CRUD API routes for Expense model ------
// Create
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  }
  catch (error) {
    if(error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ 
      error: 'Validation failed',
      message: errors 
    });
  } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Get all
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get by ID
router.get('/:id', async (req, res) => {
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
});

// Update by ID
router.put('/:id', async (req, res) => {
  try{
    
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if ( !updatedExpense ) {
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
    
    
    if(error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: errors
      });
    }
    if( error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID format',
        message: 'Please provide a valid expense ID'
      });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    // error if entry does not exist
    if( !deletedExpense ) {
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
    // catch validation errors
    if( error.name === 'ValidationError' ){
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: errors
      });
    }
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});

// ---------------------------------------

// Upload expenses via csv/plain file
router.post('/upload', upload.single('file'), async (req, res) => {
  try{
    if(!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a csv file'
      });
    }

    const filePath = path.resolve(req.file.path);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // convert csv to array of lines
    const lines = csvStringToArray(fileContent);
    const expenses = [];
    const parseErrors = [];
    let bank = '';

    // bank1 has "Transaction Date" as first column header
    // bank2 has no header row
    if (lines.length > 0 && lines[0] && lines[0][0] === 'Transaction Date') {
      bank = 'bank1';
    } else {
      bank = 'bank2';
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      try {
        const expense = parseExpenseLine(line, bank);
        expenses.push(expense);
      } catch (lineError) {
        parseErrors.push(`Line ${i + 1}: '${line}' Error: ${lineError.message}`);
      }
    }

    // save valid expenses
    const savedExpenses = [];
    const saveErrors = [];

    for (const expenseData of expenses) {
      try {
        const expense = new Expense(expenseData);
        const savedExpense = await expense.save();
        savedExpenses.push(savedExpense);
      } catch (saveError) {
        saveErrors.push(`Expense Data: ${JSON.stringify(expenseData)} Error: ${saveError.message}`);
      }
    }

    // cleanup uploaded file
    await fs.unlink(filePath);

    return res.status(201).json({
      message: 'File processed',
      summary: {
        totalLines: lines.length,
        successfullyParsed: expenses.length,
        savedToDatabase: savedExpenses.length,
        parseErrors: parseErrors.length,
        saveErrors: saveErrors.length
      },
      savedExpenses,
      errors: {
        parseErrors: parseErrors,
        saveErrors: saveErrors
      }
    });

  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process file'
    });
  }
});

// Split an expense array into appropriate fields depending on bank
// input: line - array of strings representing columns
// return: expense object
function parseExpenseLine(line, bank) {

  let date = line[0];
  let amountStr = bank === 'bank1' ? line[5] : line[1];
  let description = bank === 'bank1' ? line[2] : line[4];

  // validate and parse amount
  const amountNum = (-1)*parseFloat(amountStr);
  if (isNaN(amountNum)) {
    throw new Error('Invalid amount format');
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }

  return {
    date: dateObj,
    description: description,
    amount: amountNum,
    category: 'unsorted',
    paymentMethod: 'other'
  }
}

// Convert csv string to 2 dimensional array (grid format)
// each row is an array of column values
function csvStringToArray (strData) {
    const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ? 
            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
            arrMatches[3]);
    }
    return arrData;
}

module.exports = router;
// for testing
module.exports.parseExpenseLine = parseExpenseLine;
const fs = require('fs').promises;
const path = require('path');
const uploadService = require('../services/uploadService');

// Process CSV file and create expenses
const processExpenseCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      error: 'File upload failed',
      message: 'No CSV file provided' 
    });
  }

  const fileValidation = uploadService.validateCSVFile(req.file);
  if (!fileValidation.isValid) {
    await cleanupFile(req.file.path);
    return res.status(400).json({
      error: 'File validation failed',
      message: fileValidation.errors
    });
  } 

  try {
    // read file as string
    const filePath = path.resolve(req.file.path);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const result = uploadService.processCSVData(fileContent);

    // validate we have data to process
    if (result.expenses.length === 0) {
      await cleanupFile(req.file.path);
      return res.status(400).json({ 
        error: 'No valid data found',
        message: 'CSV file contains no processable expense data',
        parseErrors: result.parseErrors
      });
    }

    // save to database
    const savedExpenses = await uploadService.saveExpenses(result.expenses);

    // clean up uploaded file
    await cleanupFile(req.file.path);

    res.status(201).json({
      message: 'CSV imported successfully',
      totalLines: result.totalLines,
      parsed: result.expenses.length,
      imported: savedExpenses.length,
      parseErrors: result.parseErrors.length > 0 ? result.parseErrors : undefined
    });
  } catch (error) {
    await cleanupFile(req.file.path);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Data validation failed',
        message: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'File processing failed',
      message: error.message 
    });
  }
};

// Helper function to safely clean up files
const cleanupFile = async (filePath) => {
  try {
    if (filePath) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error('Failed to cleanup file:', error.message);
  }
};

module.exports = {
  processExpenseCSV
};

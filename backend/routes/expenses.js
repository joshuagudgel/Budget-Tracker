const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const uploadController = require('../controllers/uploadController');
const { csvUpload } = require('../middleware/upload');

// CRUD routes
router.post('/', expenseController.create);
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.updateById);
router.delete('/:id', expenseController.deleteById);

// Upload route
router.post('/upload', csvUpload.single('file'), uploadController.processExpenseCSV);

module.exports = router;
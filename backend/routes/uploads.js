const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { csvUpload } = require('../middleware/upload');

// CSV upload routes
router.post('/expenses', csvUpload.single('file'), uploadController.processExpenseCSV);

module.exports = router;
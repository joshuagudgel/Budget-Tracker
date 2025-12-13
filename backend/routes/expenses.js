const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// CRUD routes
router.post('/', expenseController.create);
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.updateById);
router.delete('/:id', expenseController.deleteById);

module.exports = router;
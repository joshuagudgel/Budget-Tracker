const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// CRUD routes
router.post('/', transactionController.create);
router.post('/many', transactionController.createMany);
router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);
router.put('/:id', transactionController.updateById);
router.delete('/:id', transactionController.deleteById);

module.exports = router;
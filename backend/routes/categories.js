const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CRUD routes
router.post('/', categoryController.create);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.put('/:id', categoryController.updateById);
router.delete('/:id', categoryController.deleteById);

module.exports = router;
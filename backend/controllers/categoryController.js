const Category = require('../models/Category');

// Create category
const create = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
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

// Get all categories
const getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get category by ID
const getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No category found with ID: ${req.params.id}`
      });
    } 
    return res.status(200).json(category);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'Please provide a valid category ID'
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update category by ID
const updateById = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No category found with ID: ${req.params.id}`
      });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete category by ID
const deleteById = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No category found with ID: ${req.params.id}`
      });
    }
    return res.status(200).json({
      message: 'Category deleted successfully',
      category: deletedCategory
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById
};
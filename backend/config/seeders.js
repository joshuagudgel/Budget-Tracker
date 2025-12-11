const Category = require('../models/Category');

const seedCategories = async () => {
  try {
    console.log("Seeding categories...");
    const categoryCount = await Category.countDocuments();
    console.log(`Found ${categoryCount} categories`);
    if (categoryCount === 0) {
      console.log("No categories found, seeding default categories...");
      const defaultCategories = [
        {
          name: 'food',
          displayName: 'Food & Dining',
          color: '#FF6B6B',
          budgetLimit: 500
        },
        {
          name: 'transport',
          displayName: 'Transportation',
          color: '#4ECDC4',
          budgetLimit: 300
        },
        {
          name: 'entertainment',
          displayName: 'Entertainment',
          color: '#9B59B6',
          budgetLimit: 200
        },
        {
          name: 'utilities',
          displayName: 'Utilities',
          color: '#F39C12',
          budgetLimit: 150
        },
        {
          name: 'health',
          displayName: 'Health',
          color: '#E74C3C',
          budgetLimit: 100
        },
        {
          name: 'unsorted',
          displayName: 'Unsorted',
          color: '#AAAAAA',
          budgetLimit: 3000,
        },
        {
          name: 'other',
          displayName: 'Other',
          color: '#95A5A6',
          budgetLimit: 100
        }
      ];
      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded');
    } else {
      console.log("Categories already exist, skipping seed");
      // Show what categories exist
      const existingCategories = await Category.find({}, 'name displayName');
      console.log('Existing categories:', existingCategories);
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}


module.exports = { seedCategories };
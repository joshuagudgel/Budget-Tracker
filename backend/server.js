const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { seedCategories } = require('./config/seeders');
const expenseRoutes = require('./routes/expenses');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT;

// Connect to Database
const initializeApp = async () => {
  await connectDB();
  await seedCategories();
}

initializeApp();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// App route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Budget Tracker API is running!',
    endpoints: {
      expenses: '/api/expenses',
      categories: '/api/categories'
    }
  });
});

app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
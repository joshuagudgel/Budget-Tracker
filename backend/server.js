const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { seedCategories } = require('./config/seeders');
const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');
const backupRoutes = require('./routes/backup');
const uploadRoutes = require('./routes/uploads');

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
      transactions: '/api/transactions',
      categories: '/api/categories',
      backup: '/api/backup',
      upload: '/api/upload'
    }
  });
});

app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/backup/', backupRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
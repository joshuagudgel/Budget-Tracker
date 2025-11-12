const mongoose = require('mongoose');
const Category = require('../models/Category');


const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
}

const disconnectDB = async () => {
    try {
      await mongoose.disconnect(MONGODB_URI);
      console.log('Disconnected from MongoDB');
    } catch (err) {
      console.error('MongoDB disconnection error:', err);
    }
}


module.exports = { connectDB, disconnectDB };
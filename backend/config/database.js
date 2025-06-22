import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    let mongoURI;
    
    if (process.env.NODE_ENV === 'test') {
      mongoURI = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1/smart_recipe_optimizer_test';
      console.log('Test environment - using test database');
    } else {
      mongoURI = process.env.MONGODB_URI;
      console.log('Production environment - using MongoDB Atlas');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      console.log('Test environment - continuing without database connection');
    }
  }
};

export default connectDB;

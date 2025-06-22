import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

export const setupTestDatabase = async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  }
};

export const clearTestDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      for (let collection of collections) {
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error('Database clear error:', error);
  }
};

export const closeTestDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongod) {
      await mongod.stop();
    }
    console.log('✅ Test database closed');
  } catch (error) {
    console.error('Database close error:', error);
  }
};

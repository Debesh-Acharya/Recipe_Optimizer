import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import recipeRoutes from './routes/recipeRoutes.js';
import optimizationRoutes from './routes/optimizationRoutes.js';

dotenv.config();

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/recipes', recipeRoutes);
app.use('/api/optimize', optimizationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Smart Recipe Optimizer API - Ready!' });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS enabled for http://localhost:5173`);
  });
}

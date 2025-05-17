import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(
  { 
    methods: ['GET', 'POST', 'PUT', 'PATCH'], 
    origin: '*', 
    optionsSuccessStatus: 200, 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));

connectDB();

app.use('/api/users', userRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'User Service', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

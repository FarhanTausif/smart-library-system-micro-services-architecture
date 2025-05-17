import express from 'express';
import dotenv from 'dotenv';
import loanRoutes from './routes/loanRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', loanRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Loan-Service is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Loan-Service running on port ${PORT}`);
});

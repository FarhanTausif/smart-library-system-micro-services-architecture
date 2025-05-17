import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'PATCH']
}));

connectDB();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Book Service', timestamp: new Date().toISOString() });
}
);

app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Book Service running on port ${PORT}`);
});

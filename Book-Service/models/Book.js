import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  copies: { type: Number, required: true },
  available_copies: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Book', bookSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'librarian', 'admin'], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date }
});

export default mongoose.model('User', userSchema);

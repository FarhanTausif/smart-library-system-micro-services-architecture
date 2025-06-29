import { Router } from 'express';
import {
  createUserService,
  getUserByIdService,
  updateUserService,
  getAllUsersService
} from '../services/userService.js';

const router = Router();

// Create/register a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'name, email, and role are required' });
    }
    const user = await createUserService({ name, email, role });
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at.toISOString()
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at ? user.updated_at.toISOString() : undefined
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user information
router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await updateUserService(req.params.id, { name, email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at ? user.updated_at.toISOString() : undefined
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

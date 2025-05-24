import User from '../models/User.js';

export async function createUserService({ name, email, role }) {
  const now = new Date();
  const user = new User({ name, email, role, created_at: now, updated_at: now });
  await user.save();
  return user;
}

export async function getUserByIdService(id) {
  return User.findById(id);
}

export async function updateUserService(id, { name, email }) {
  const user = await User.findById(id);
  if (!user) return null;
  if (name) user.name = name;
  if (email) user.email = email;
  user.updated_at = new Date();
  await user.save();
  return user;
}

export async function getAllUsersService() {
  try {
    const users = await User.find();
    return users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

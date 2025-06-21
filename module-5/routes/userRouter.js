const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../db/userQueries');

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return user
      ? res.json(user)
      : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    return user
      ? res.json(user)
      : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    return deleted
      ? res.json({ message: 'User deleted', user: deleted })
      : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;




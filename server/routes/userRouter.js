const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth-middleware');

const router = express.Router();

// Protected Route - All logged-in users
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});

// Admin only route
router.get('/all', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted: List of all users' });
});

module.exports = router;

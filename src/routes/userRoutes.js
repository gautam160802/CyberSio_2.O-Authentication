const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Register (open to all)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // role optional, default 'user' in service
    const data = await AuthService.register({ name, email, password, role });
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login (open to all)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login({ email, password });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Example protected route accessible by any logged-in user (user or admin)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to your profile!', user: req.user });
});

// Example admin-only route
router.get('/admin/dashboard', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin to dashboard' });
});

module.exports = router;

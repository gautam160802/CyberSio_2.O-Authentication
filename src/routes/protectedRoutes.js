const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Example protected route for admins only
router.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user });
});

// Example protected route for users only
router.get('/user/profile', authenticate, authorize('user'), (req, res) => {
  res.json({ message: 'Welcome User!', user: req.user });
});

module.exports = router;

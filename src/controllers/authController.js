const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  console.log("req.body", req.body);
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, role || 'user']
    );
    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!user.rows[0]) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = generateToken(user.rows[0]);
    const refreshToken = generateRefreshToken(user.rows[0]);

    res.json({ message: 'Login successful', token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Refresh token route
const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'Refresh token required' });

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  // For stateless JWT, just delete token on client-side
  res.json({ message: 'Logout successful' });
};

module.exports = { register, login, logout, refreshToken };

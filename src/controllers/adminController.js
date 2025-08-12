const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email exists
    const exists = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
    if (exists.rows.length) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO admins (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, created_at',
      [email, hashedPassword, name, role || 'admin']
    );

    const admin = result.rows[0];

    // Create JWT token
    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({ admin, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const r = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (!r.rows.length) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const admin = r.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ admin: { id: admin.id, email: admin.email, name: admin.name }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

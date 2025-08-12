// // src/services/authService.js
// const pool = require('../database/db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

// const AuthService = {};

// AuthService.register = async ({ name, email, password, role = 'user' }) => {
//   if (!name || !email || !password) throw new Error('Missing fields');

//   const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
//   if (exists.rows.length) throw new Error('Email already registered');

//   const hashed = await bcrypt.hash(password, 10);

//   const res = await pool.query(
//     `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`,
//     [name, email, hashed, role]
//   );

//   const user = res.rows[0];

//   const token = jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     JWT_SECRET,
//     { expiresIn: JWT_EXPIRES_IN }
//   );

//   return { user, token };
// };

// AuthService.login = async ({ email, password }) => {
//   if (!email || !password) throw new Error('Missing fields');

//   const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//   if (!res.rows.length) throw new Error('Invalid credentials');

//   const user = res.rows[0];
//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) throw new Error('Invalid credentials');

//   const token = jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     JWT_SECRET,
//     { expiresIn: JWT_EXPIRES_IN }
//   );

//   return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
// };

// module.exports = AuthService;

const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh');
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const AuthService = {};

// Register (user or admin)
AuthService.register = async ({ username, email, password, role = 'user' }) => {
  if (!email || !password || (role === 'user' && !username)) {
    throw new Error('Missing fields');
  }

  // Check if email already exists
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (exists.rows.length) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, 10);

  const res = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
    [username || null, email, hashed, role]
  );

  const user = res.rows[0];

  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [user.id, refreshToken]
  );

  return { user, accessToken, refreshToken };
};

// Login (user or admin)
AuthService.login = async ({ email, password }) => {
  if (!email || !password) throw new Error('Missing fields');

  const r = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!r.rows.length) throw new Error('Invalid credentials');

  const user = r.rows[0];
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  await pool.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')', [user.id, refreshToken]);

  return {
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

// Refresh token
AuthService.refresh = async (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token provided');

  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch {
    throw new Error('Invalid refresh token');
  }

  const r = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false', [refreshToken]);
  if (!r.rows.length) throw new Error('Refresh token revoked or not found');

  const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { accessToken: newAccessToken };
};

// Logout (revoke refresh token)
AuthService.logout = async (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token provided');
  await pool.query('UPDATE refresh_tokens SET revoked = true WHERE token = $1', [refreshToken]);
};

module.exports = AuthService;


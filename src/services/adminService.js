const pool = require('../database/db');
const { comparePassword, generateAccessToken } = require('./authUtils');

const adminService = {};

adminService.login = async ({ email, password }) => {
  if (!email || !password) throw new Error('Email and password required');

  const res = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
  if (res.rows.length === 0) throw new Error('Admin not found');

  const admin = res.rows[0];
  const valid = await comparePassword(password, admin.password);
  if (!valid) throw new Error('Invalid credentials');

  const tokenPayload = { id: admin.id, email: admin.email, role: 'admin' };
  const accessToken = generateAccessToken(tokenPayload);

  // Return admin info without password, plus token
  return {
    admin: { id: admin.id, email: admin.email, name: admin.name || null },
    accessToken,
  };
};

module.exports = adminService;

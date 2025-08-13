const pool = require('../database/db');
const crypto = require('crypto');

const createLicense = async (req, res) => {
  const { user_id, product_name } = req.body;
  try {
    // Generate a secure license key with HMAC
    const licenseKey = crypto
      .createHmac('sha256', process.env.LICENSE_HMAC_SECRET)
      .update(user_id + product_name + Date.now())
      .digest('hex');

    const result = await pool.query(
      'INSERT INTO licenses (user_id, product_name, license_key) VALUES ($1, $2, $3) RETURNING *',
      [user_id, product_name, licenseKey]
    );

    res.status(201).json({ message: 'License created', license: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserLicenses = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT * FROM licenses WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const validateLicense = async (req, res) => {
  const { license_key, product_name, user_id } = req.body;

  if (!license_key || !product_name || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Recompute HMAC to verify license key
    const expectedKey = crypto
      .createHmac('sha256', process.env.LICENSE_HMAC_SECRET)
      .update(user_id + product_name + Date.parse(new Date()))
      .digest('hex');

    // Check license exists in DB
    const result = await pool.query(
      'SELECT * FROM licenses WHERE license_key = $1 AND user_id = $2 AND product_name = $3 AND status = $4',
      [license_key, user_id, product_name, 'active']
    );

    if (!result.rows.length) {
      return res.status(404).json({ valid: false, message: 'License not valid or inactive' });
    }

    res.json({ valid: true, license: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createLicense, getUserLicenses, validateLicense };

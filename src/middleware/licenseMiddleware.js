const pool = require('../database/db');

const licenseMiddleware = async (req, res, next) => {
  try {
    // Extract license key from headers (or wherever you send it)
    const licenseKey = req.headers['x-license-key'];

    if (!licenseKey) {
      return res.status(401).json({ error: 'License key required' });
    }

    // Query DB to check if license is valid and active
    const result = await pool.query(
      'SELECT * FROM licenses WHERE license_key = $1 AND is_active = true',
      [licenseKey]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid or inactive license' });
    }

    // Optionally check expiry or other license fields here
    // const license = result.rows[0];
    // if (license.expires_at < new Date()) {
    //   return res.status(403).json({ error: 'License expired' });
    // }

    // License is valid, proceed
    next();
  } catch (error) {
    console.error('License Middleware Error:', error);
    res.status(500).json({ error: 'Server error in license validation' });
  }
};

module.exports = licenseMiddleware;

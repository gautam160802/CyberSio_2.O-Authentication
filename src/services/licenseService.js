const pool = require('../database/db');
const crypto = require('crypto');

function generateRawKey(product, plan) {
  const b = crypto.randomBytes(16).toString('base64url');
  return `${product.toUpperCase()}-${plan.toUpperCase()}-${b}`;
}

function hashKey(key) {
  return crypto.createHmac('sha256', process.env.LICENSE_HMAC_SECRET || 'lic_secret')
               .update(key).digest('hex');
}

const LicenseService = {
  create: async ({ product, plan = 'pro', expiresInDays = null, maxDevices = 1, metadata = {} }) => {
    const rawKey = generateRawKey(product, plan);
    const hashed = hashKey(rawKey);

    const expires_at = expiresInDays ? `NOW() + INTERVAL '${parseInt(expiresInDays)} days'` : null;

    const sql = `INSERT INTO licenses (license_key, license_hash, product, plan, max_devices, metadata, expires_at)
                 VALUES ($1, $2, $3, $4, $5, $6, ${expires_at ? expires_at : 'NULL'})
                 RETURNING id, license_key, product, plan, issued_at, expires_at, status, max_devices, metadata`;

    const vals = [rawKey, hashed, product, plan, maxDevices, JSON.stringify(metadata)];
    const res = await pool.query(sql, vals);
    return res.rows[0];
  },

  findByKey: async (key) => {
    const hash = hashKey(key);
    const res = await pool.query('SELECT * FROM licenses WHERE license_hash = $1', [hash]);
    return res.rows[0] || null;
  },

  assignToUser: async (licenseId, userId, actorId = null) => {
    await pool.query('UPDATE licenses SET issued_to_user = $1 WHERE id = $2', [userId, licenseId]);
    await pool.query('INSERT INTO license_audit (license_id, action, actor_id, details) VALUES ($1,$2,$3,$4)',
                     [licenseId, 'assigned', actorId, JSON.stringify({userId})]);
  },

  revoke: async (licenseId, actorId = null) => {
    await pool.query('UPDATE licenses SET status=$1, revoked_at=NOW() WHERE id=$2', ['revoked', licenseId]);
    await pool.query('INSERT INTO license_audit (license_id, action, actor_id, details) VALUES ($1,$2,$3,$4)',
                     [licenseId, 'revoked', actorId, JSON.stringify({})]);
  },

  validate: async (rawKey) => {
    const lic = await LicenseService.findByKey(rawKey);
    if (!lic) return { valid: false, reason: 'not_found' };
    if (lic.status !== 'active') return { valid: false, reason: lic.status };
    if (lic.expires_at && new Date(lic.expires_at) < new Date()) return { valid: false, reason: 'expired' };
    // add more checks if needed (max_devices etc.)
    await pool.query('INSERT INTO license_audit (license_id, action, details) VALUES ($1,$2,$3)', [lic.id, 'validated', JSON.stringify({})]);
    return { valid: true, license: lic };
  },
};

module.exports = LicenseService;

const pool = require('./db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected, current time:', res.rows[0]);
    process.exit();
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
})();

// // src/database/db.js
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST || '127.0.0.1',
//   database: process.env.PGDB,
//   password: process.env.PGPASSWORD,
//   port: Number(process.env.PGPORT) || 5432,
// });

// pool.on('error', (err) => {
//   console.error('Unexpected PG error', err);
// });

// module.exports = pool;


const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = pool;

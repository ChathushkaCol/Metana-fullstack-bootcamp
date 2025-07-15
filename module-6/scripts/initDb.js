// module-6/scripts/initDb.js

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PG_URI } = require('../config');

async function initDb() {
  const pool = new Pool({ connectionString: PG_URI });
  const sql = fs.readFileSync(path.join(__dirname, 'setup-db.sql'), 'utf8');

  try {
    await pool.query(sql);
    console.log('✅ Schema created/updated successfully.');
  } catch (err) {
    console.error('🔴 Error running setup-db.sql:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();


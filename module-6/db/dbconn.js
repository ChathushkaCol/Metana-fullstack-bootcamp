const { Pool } = require('pg');
const { PG_URI } = require('../config');
const pool = new Pool({ connectionString: PG_URI });
module.exports = pool;





const pool = require('../db/dbconn');

// CRUD for users table

async function createUser(data) {
  const { name, email } = data;
  const res = await pool.query(
    `INSERT INTO users(name, email) VALUES ($1, $2) RETURNING *`,
    [name, email]
  );
  return res.rows[0];
}

async function getAllUsers() {
  const res = await pool.query(`SELECT * FROM users ORDER BY id`);
  return res.rows;
}

async function getUserById(id) {
  const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return res.rows[0];
}

async function updateUser(id, data) {
  const { name, email } = data;
  const res = await pool.query(
    `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
    [name, email, id]
  );
  return res.rows[0];
}

async function deleteUser(id) {
  const res = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );
  return res.rows[0];
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};



const pool = require('../db/dbconn');

// CRUD for blogs table

async function createBlog(data) {
  const { user_id, title, content } = data;
  const res = await pool.query(
    `
      INSERT INTO blogs(user_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING *, (SELECT name FROM users WHERE users.id = blogs.user_id) AS user_name
    `,
    [user_id, title, content]
  );
  return res.rows[0];
}

async function getAllBlogs() {
  const res = await pool.query(`
    SELECT blogs.*, users.name AS user_name
      FROM blogs
      JOIN users ON blogs.user_id = users.id
      ORDER BY blogs.id
  `);
  return res.rows;
}

async function getBlogById(id) {
  const res = await pool.query(`
    SELECT blogs.*, users.name AS user_name
      FROM blogs
      JOIN users ON blogs.user_id = users.id
      WHERE blogs.id = $1
  `, [id]);
  return res.rows[0];
}

async function updateBlog(id, data) {
  const { user_id, title, content } = data;
  const res = await pool.query(
    `
      UPDATE blogs
        SET user_id=$1, title=$2, content=$3
        WHERE id=$4
      RETURNING *
    `,
    [user_id, title, content, id]
  );
  return res.rows[0];
}

async function deleteBlog(id) {
  const res = await pool.query(
    `DELETE FROM blogs WHERE id=$1 RETURNING *`,
    [id]
  );
  return res.rows[0];
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};







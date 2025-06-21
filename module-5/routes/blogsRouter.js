const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../db/blogQueries');

const router = express.Router();

// Create a new blog
router.post('/', async (req, res) => {
  try {
    const blog = await createBlog(req.body);
    return res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    return res.json(blogs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Get a blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await getBlogById(req.params.id);
    return blog
      ? res.json(blog)
      : res.status(404).json({ error: 'Blog not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Update a blog by ID
router.put('/:id', async (req, res) => {
  try {
    const blog = await updateBlog(req.params.id, req.body);
    return blog
      ? res.json(blog)
      : res.status(404).json({ error: 'Blog not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete a blog by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteBlog(req.params.id);
    return deleted
      ? res.json({ message: 'Blog deleted', blog: deleted })
      : res.status(404).json({ error: 'Blog not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;







const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../db/blogQueries');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await createBlog(req.body)); }
  catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try { res.json(await getAllBlogs()); }
  catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const b = await getBlogById(req.params.id);
    b ? res.json(b) : res.status(404).json({ error: 'Blog not found' });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const b = await updateBlog(req.params.id, req.body);
    b ? res.json(b) : res.status(404).json({ error: 'Blog not found' });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const b = await deleteBlog(req.params.id);
    b ? res.json({ deleted: b }) : res.status(404).json({ error: 'Blog not found' });
  } catch (err) { next(err); }
});

module.exports = router;




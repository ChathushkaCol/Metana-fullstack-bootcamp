const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../db/userQueries');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await createUser(req.body)); }
  catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try { res.json(await getAllUsers()); }
  catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const u = await getUserById(req.params.id);
    u ? res.json(u) : res.status(404).json({ error: 'User not found' });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const u = await updateUser(req.params.id, req.body);
    u ? res.json(u) : res.status(404).json({ error: 'User not found' });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const u = await deleteUser(req.params.id);
    u ? res.json({ deleted: u }) : res.status(404).json({ error: 'User not found' });
  } catch (err) { next(err); }
});

module.exports = router;






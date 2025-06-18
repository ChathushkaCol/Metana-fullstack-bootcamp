const express = require('express');
const router = express.Router();
const Joke = require('../models/Joke');

// GET all jokes
router.get('/jokes', async (req, res) => {
  try {
    const jokes = await Joke.find().sort({ rating: -1 });
    res.render('home', { jokes });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new joke
router.post('/jokes', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).send('Joke content is required.');

  try {
    const joke = new Joke({ content });
    await joke.save();
    res.redirect('/api/jokes');
  } catch (err) {
    res.status(400).send('Joke may already exist or is invalid.');
  }
});

// POST rate a joke
router.post('/jokes/:id/rate', async (req, res) => {
  const { rating } = req.body;
  try {
    const joke = await Joke.findById(req.params.id);
    joke.rating = parseInt(rating);
    await joke.save();
    res.redirect('/api/jokes');
  } catch (err) {
    res.status(400).send('Unable to rate joke.');
  }
});

module.exports = router;
router.post('/jokes', async (req, res) => {
  try {
    const newJoke = new Joke({ content: req.body.content });
    await newJoke.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error saving joke:', error.message);
    res.status(500).send('Error saving joke');
  }
});
router.get('/', async (req, res) => {
  const jokes = await Joke.find().sort({ createdAt: -1 });
  res.render('home', { jokes });
});
router.post('/jokes/:id/rate', async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const joke = await Joke.findById(id);
    if (!joke) return res.status(404).send('Joke not found');

    joke.rating = rating;
    await joke.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Error updating rating');
  }
});
// Upvote joke
router.post('/:id/upvote', async (req, res) => {
  await Joke.findByIdAndUpdate(req.params.id, { $inc: { rating: 1 } });
  res.redirect('/jokes');
});

// Downvote joke
router.post('/:id/downvote', async (req, res) => {
  await Joke.findByIdAndUpdate(req.params.id, { $inc: { rating: -1 } });
  res.redirect('/jokes');
});


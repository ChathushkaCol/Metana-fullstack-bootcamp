const mongoose = require('mongoose');

const jokeSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Joke', jokeSchema);

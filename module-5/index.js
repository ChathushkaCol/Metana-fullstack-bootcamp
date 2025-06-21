const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectToDB = require('./db/dbconn');
const { PORT } = require('./config');
const userRouter = require('./routes/userRouter');
const blogRouter = require('./routes/blogsRouter');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to M5 API! Use /api/users or /api/blogs');
});

// API routes
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

// Start server after DB connection
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});



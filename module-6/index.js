const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db/dbconn');
const userRouter = require('./routes/userRouter');
const blogRouter = require('./routes/blogsRouter');

async function startServer() {
  try {
    await pool.connect();
    console.log('✅ PostgreSQL connected');
    const app = express();
    app.use(cors(), morgan('dev'), express.json());
    app.use('/api/users', userRouter);
    app.use('/api/blogs', blogRouter);
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log(`🚀 Listening on port ${process.env.PORT || 3000}`)
    );
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
}

startServer();








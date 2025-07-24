import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API running...');
});

app.get('/api/blogs', (req, res) => {
  res.json([
    { id: 1, title: 'First Blog' },
    { id: 2, title: 'Second Blog' }
  ]);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

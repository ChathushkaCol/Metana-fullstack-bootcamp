
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars'); // Make sure you installed this
const Joke = require('./models/Joke');

const app = express();

// Set up Handlebars with helpers
const hbs = exphbs.create({
  helpers: {
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==': return v1 == v2 ? options.fn(this) : options.inverse(this);
        case '===': return v1 === v2 ? options.fn(this) : options.inverse(this);
        case '!=': return v1 != v2 ? options.fn(this) : options.inverse(this);
        case '!==': return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case '<': return v1 < v2 ? options.fn(this) : options.inverse(this);
        case '<=': return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case '>': return v1 > v2 ? options.fn(this) : options.inverse(this);
        case '>=': return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case '&&': return v1 && v2 ? options.fn(this) : options.inverse(this);
        case '||': return v1 || v2 ? options.fn(this) : options.inverse(this);
        default: return options.inverse(this);
      }
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));



mongoose.connect('mongodb+srv://cacshan:Shan%407822@cluster0.abcde.mongodb.net/jokeapp?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));






// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (req, res) => {
  try {
    const jokes = await Joke.find().sort({ createdAt: -1 });
    res.render('home', { jokes });
  } catch (err) {
    res.status(500).send('Error loading jokes');
  }
});

app.post('/submit', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.redirect('/');

  try {
    await Joke.create({ content });
  } catch (err) {
    console.error('Error creating joke:', err.message);
  }

  res.redirect('/');
});

app.post('/rate', async (req, res) => {
  const { id, rating } = req.body;

  try {
    await Joke.findByIdAndUpdate(id, { rating });
  } catch (err) {
    console.error('Error rating joke:', err.message);
  }

  res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






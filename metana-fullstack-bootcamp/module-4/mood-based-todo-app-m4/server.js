const express = require('express');
const path = require('path');
const weatherRoute = require('./routes/weather'); // Import your weather route

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming JSON payloads
app.use(express.json());

// Use weather route under /api
app.use('/api', weatherRoute);

// Optional root route (can later be rendered with Handlebars)
app.get('/', (req, res) => {
  res.render('home'); // if you have views/home.handlebars
});


// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
const exphbs = require('express-handlebars');

// Setup Handlebars engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Render home.handlebars on /
app.get('/', (req, res) => {
  res.render('home');
});


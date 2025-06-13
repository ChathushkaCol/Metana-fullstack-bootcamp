const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, coding wizard!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
app.get('/greet/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}! Welcome to the server!`);
});
const fortunes = [
  "You will write amazing code today!",
  "A new bug will teach you something valuable.",
  "You’re just one line away from greatness.",
  "The compiler believes in you.",
  "An exciting pull request is coming your way!"
];

app.get('/fortune', (req, res) => {
  const random = Math.floor(Math.random() * fortunes.length);
  res.send(fortunes[random]);
});

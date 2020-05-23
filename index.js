const express = require('express');
const app = express();

app.use(express.json());

const genres = [
  { id: 1, name: 'Action 🚗 💨' },  
  { id: 2, name: 'Horror 👹' },  
  { id: 3, name: 'Romance 👩‍❤️‍👨' },  
];

app.get('/api/genres', (req, res) => {
  console.log(genres);
  res.send(genres);
});

app.post('/api/genres', (req, res) => {
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre);
  res.send(genre);
});

const port = process.env.port || 5000;
app.listen(port, () => console.log(`🏎Listening on port: ${port}`));
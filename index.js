const express = require('express');
const app = express();

const genres = [
  { id: 1, name: 'Action 🚗 💨' },  
  { id: 2, name: 'Horror 👹' },  
  { id: 3, name: 'Romance 👩‍❤️‍👨' },  
];

app.get('/', (req, res) => {
  console.log(genres);
  res.send(genres);
});

const port = process.env.port || 5000;
app.listen(port, () => console.log(`🏎Listening on port: ${port}`));
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bello ✋');
})

const port = process.env.port || 5000;
app.listen(port, () => console.log(`🏎Listening on port: ${port}`));
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const debug  =require('debug')('node:index');


app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.port || 5000;
app.listen(port, () => debug(`🏁 🏎 ⚡️ ⚡️ Listening on port: ${port} ⚡️ ⚡️`));
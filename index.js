const express = require('express');
const app = express();
const genres = require('./routes/genres');
const debug = require('debug')('node:index');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly')
  .then(() => debug('☘️ ☘️ Connected to Mongo DB ☘️ ☘️'))
  .catch(err => debug('🍃 🍃 Unable to connect Mongo 🍃 🍃', err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/genres', genres);

const port = process.env.port || 5000;
app.listen(port, () => debug(`🏁 🏎 ⚡️ ⚡️ Listening on port: ${port} ⚡️ ⚡️`));
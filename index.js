const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies =  require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const debug = require('debug')('node:index');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

mongoose.connect('mongodb://localhost/vidly')
  .then(() => debug('☘️ ☘️ Connected to Mongo DB ☘️ ☘️'))
  .catch(err => debug('🍃 🍃 Unable to connect Mongo 🍃 🍃', err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

const port = process.env.port || 5000;
app.listen(port, () => debug(`🏁 🏎 ⚡️ ⚡️ Listening on port: ${port} ⚡️ ⚡️`));

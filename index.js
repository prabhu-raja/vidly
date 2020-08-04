require('express-async-errors');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies =  require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const debug = require('debug')('node:index');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
const error = require('./middleware/error');
Joi.objectId = require('joi-objectid')(Joi);

if (!config.get('jwtPrivateKey')) {
  debug('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1); // * 0 means success. except 0 it's error
}
debug(`Conf val - ${config.get('jwtPrivateKey')}`);

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
app.use('/api/auth', auth);
app.use(error);

const port = process.env.port || 5000;
app.listen(port, () => debug(`🏁 🏎 ⚡️ ⚡️ Listening on port: ${port} ⚡️ ⚡️`));

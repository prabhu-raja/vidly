const express = require('express');
const router = express.Router();
const debug = require('debug')('node:genre');
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleWare = require('../middleware/asyncerrorhandle');

router.get('/', asyncMiddleWare(async (req, res, next) => {
  const genres = await Genre
    .find()
    .sort({name: 'asc'})
    .select({name: 1});
  debug('Get all Genres', genres);
  res.send(genres);
}));

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //
  const genre = new Genre({ name: req.body.name });
  try {
    debug('🏳️‍🌈 Genre req.user', req.user);
    await genre.validate();
    const result = await genre.save();
    debug('Post Genre Res.send 📮', result);
    res.send(result);
  } catch (err) {
    for (const field in err.errors) {
      if (err.errors.hasOwnProperty(field)) {
        debug(err.errors[field].message);
      }
    }
  }
});

router.put('/:id', async (req, res) => {
  // * 400 - Bad Request
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  
  // * 404 - Not Found
  const genre = await Genre.findByIdAndUpdate(req.params.id, 
    {name: req.body.name},
    {new: true});
  if (!genre) { return res.status(404).send('Genre Id not found 😈')}

  // * 200  - Update
  debug('Updated 😎', genre);
  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  // * 404 - Not Found
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) { return res.status(404).send('Genre Id not found 😈')}

  debug('Deleted ❌ ', genre);
  res.send(genre);
});

router.get('/:id', async (req, res) => {
  // * 404 - Not Found
  const genre = await Genre.findById(req.params.id).select('name');
  if (!genre) { return res.status(404).send('Genre Id not found 😈')}

  debug('Get by Id 🛍 ', genre);
  res.send(genre);
});

module.exports = router;

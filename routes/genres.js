const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const debug = require('debug')('node:genre');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25
  }
});

const Genre = mongoose.model('Genre', genreSchema);

router.get('/', async (req, res) => {
  const genres = await Genre
    .find()
    .sort({name: 'asc'})
    .select({name: 1});
  res.send(genres);
});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //
  const genre = new Genre({ name: req.body.name });
  try {
    await genre.validate();
    const result = await genre.save();
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
  const { error } = validateGenre(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  
  // * 404 - Not Found
  const genre = await Genre.findByIdAndUpdate(req.params.id, 
    {name: req.body.name},
    {new: true});
  if (!genre) { return res.status(404).send('Genre Id not found 😈')}

  // * 200  - Update
  res.send(genre);
});

router.delete('/:id', (req, res) => {
  // * 404 - Not Found
  const genre = genres.find(val => val.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send('Genre Id not found 😈')
  }
  const indx = genres.indexOf(genre);
  genres.splice(indx, 1);
  res.send(genre);
});

router.get('/:id', (req, res) => {
  // * 404 - Not Found
  const genre = genres.find(val => val.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send('Genre Id not found 😈')
  }
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema);
}

module.exports = router;

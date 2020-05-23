const express = require('express');
const router = express.Router();
const Joi = require('joi');
const debug  =require('debug')('node:genre');

const genres = [
  { id: 1, name: 'Action 🚗 💨' },  
  { id: 2, name: 'Horror 👹' },  
  { id: 3, name: 'Romance 👩‍❤️‍👨' },  
];

router.get('/', (req, res) => {
  debug(genres);
  res.send(genres);
});

router.post('/', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre);
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema);
}

module.exports = router;

const express =  require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const debug = require('debug')('node:movies');

router.get('/', async(req, res) => {
  const movies = await Movie
    .find()
    .sort({title: 'asc'});
  debug('Get all 🎞', JSON.stringify(movies, null, 2));
  res.send(movies);
});

router.post('/', async(req, res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) { return res.status(404).send('Genre Id not found 😈')}

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  try {
    await movie.validate;
    await movie.save();
    // res.send(result);
    res.send(movie);
  } catch (err) {
    for (field in err.errors) {
      debug('😡', err.errors[field].message);
    }
  }
});

router.put('/:id', async(req, res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //
  const movie = Movie.findByIdAndUpdate(req.params.id, 
    {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    {new: true}
  );

  if(!movie) {return res.status(404).send('😡 Movie not found');}
  
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if(!movie) { return res.status(404).send('😡 Movie not found'); }
  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = Movie.findById(req.params.id)
    .select({
      title: 1,
      genre: 1,
      numberInStock: 1,
      dailyRentalRate: 1
    });
    if(!movie) { return res.status(404).send('😡 Movie not found'); }
    res.send(movie);
})

module.exports = router;
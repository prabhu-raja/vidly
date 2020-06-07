const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const debug = require('debug')('node:rentals');

Fawn.init(mongoose);

router.get('/', async(req, res) => {
  const rentals = await Rental
    .find()
    .sort('-dateOut');
  debug('Get all 📀', JSON.stringify(rentals, null, 2));
  res.send(rentals);
});

router.post('/', async(req, res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //
  const customer = await Customer.findById(req.body.customerId);
  if(!customer) { return res.status(400).send('😡 Customer not found'); }
  //
  const movie = await Movie.findById(req.body.movieId);
  if(!movie) { return res.status(400).send('😡 Movie not found'); }
  if(movie.numberInStock === 0) { return res.status(400).send('🎞 Movie not in stock') }
  //
  const rental = new Rental({
    customer,
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  });

  try {
    await rental.validate();
    // const result = await rental.save();
    // movie.numberInStock--;
    // movie.save();
    // res.send(result);
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', 
        { _id: movie._id }, 
        { 
          $inc: { numberInStock: -1 }
        })
      .run();
      res.send(rental);
  } catch (err) {
    for (field in err.errors) {
      debug('😡', err.errors[field].message);
    }
    res.status(500).send('Something not right 😔');
  }
});

module.exports = router;
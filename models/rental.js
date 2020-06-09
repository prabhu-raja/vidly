const mongoose = require('mongoose');
const Joi = require('joi');
const { customersSchema } = require('./customer');

const rentalSchema = new mongoose.Schema({
  customer: { 
    type: customersSchema,
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: { 
    type: Date,
    required: true,
    default: Date.now()
   },
  dateReturned: {
    type: Date
   },
  rentalFee: { 
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
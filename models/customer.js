const mongoose = require('mongoose');
const Joi = require('joi');

const customersSchema = new mongoose.Schema({
  isGold:{
    type: Boolean,
    default: false,
    minlength: 3,
    maxlength: 30
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  }
});

const Customer = mongoose.model('Customer', customersSchema);

function validateCustomer(course) {
  const schema = {
    name: Joi.string().min(3).max(25).required(),
    phone: Joi.string().max(10).required(),
    isGold: Joi.boolean()
  }
  return Joi.validate(course, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
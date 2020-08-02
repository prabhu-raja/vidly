const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const debug = require('debug')('node:user');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //
  let user = await User.findOne({email: req.body.email});
  if (!user) { return res.status(400).send('Invalid email or password.'); }
  //
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) { return res.status(400).send('Invalid email or password.'); }
  //
  // const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
  const token = user.generateAuthtoken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(4).max(50).required().email(),
    password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(req, schema);
}

module.exports = router;
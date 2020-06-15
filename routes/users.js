const express = require('express');
const router = express.Router();
const _ = require('lodash');
const debug = require('debug')('node:user');
const { User, validate } = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User
    .find();
  res.send(users);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //
  let user = await User.findOne({email: req.body.email});
  if (user) { return res.status(400).send('User already registered'); }
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  debug('🌈', _.pick(req.body, ['name', 'email', 'password']));
  try {
    await user.validate();
    const result = await user.save();
    res.send(_.pick(result, ['name', 'email']));
  } catch (err) {
    for (const field in err.errors) {
      if (err.errors.hasOwnProperty(field)) {
        debug(err.errors[field].message);
      }
    }
  }
});

module.exports = router;
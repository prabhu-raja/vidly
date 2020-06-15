const express = require('express');
const router = express.Router();
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
  
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  try {
    await user.validate();
    const result = await user.save();
    res.send(result);
  } catch (err) {
    for (const field in err.errors) {
      if (err.errors.hasOwnProperty(field)) {
        debug(err.errors[field].message);
      }
    }
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const debug = require('debug')('node:user');
const { User, validate } = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }
  //
  let user = await User.findOne({email: req.body.email});
  if (user) { return res.status(400).send('User already registered'); }
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  try {
    await user.validate();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const result = await user.save();

    const token = user.generateAuthtoken();
    // const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    res
      .header('x-auth-token', token)
      .send(_.pick(result, ['_id', 'name', 'email']));
  } catch (err) {
    for (const field in err.errors) {
      if (err.errors.hasOwnProperty(field)) {
        debug(err.errors[field].message);
      }
    }
  }
});

module.exports = router;
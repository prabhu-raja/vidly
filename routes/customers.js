const express = require('express');
const router = express.Router();
const debug = require('debug')('node:customers');
const {Customer, validate} = require('../models/customer');

router.get('/', async (req,res) => {
  const customers = await Customer
    .find()
    .sort({name: 'asc'});
  res.send(customers);
});

router.post('/', async (req,res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }

  const customer = new Customer ({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  try {
    await customer.validate();
    const result = await customer.save();
    res.send(result);
  } catch (err) {
    for (field in err.errors) {
      debug('😡', err.errors[field].message);
    }
  }

});

router.put('/:id', async (req,res) => {
  const { error } = validate(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    },
    {new: true}
  );
  if(!customer) { return res.status(404).send('😡 Customer not found'); }

  res.send(customer);
});

router.delete('/:id', async (req,res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if(!customer) { return res.status(404).send('😡 Customer not found'); }
  res.send(customer);
});

router.get('/:id', async (req,res) => {
  const customer = await Customer.findById(req.params.id).select({
    name: 1,
    phone: 1,
    isGold: 1
  });
  if(!customer) { return res.status(404).send('😡 Customer not found'); }
  res.send(customer);
});

module.exports = router;

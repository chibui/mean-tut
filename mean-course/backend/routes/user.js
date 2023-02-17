const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user')

const router = express.Router();

router.post('/signup', (req, res, next) => {
  console.log('req', req);

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post('/login', (req, res, next) => {

});

module.exports = router;

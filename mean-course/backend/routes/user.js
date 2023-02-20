const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const JWT_SECRET = require('../constants');

const router = express.Router();

const authError = () => {
  return res.status(401).json({
    message: "Auth failed"
  });
}

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
  User.findOne({ email: req.body.email })
    .then(User => {
      if (!User) {
        authError();
      }

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        authError();
      }

      const token = jwt.sign({
        email: User.email,
        userId: User._id },
        JWT_SECRET,
        { expiresIn: '1h'}
      );
    })
    .catch(err => {
      authError();
    });
});

module.exports = router;

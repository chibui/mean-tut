const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../constants');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
        .catch(() => {
          res.status(500).json({
            message: 'Invalid authentication credentials'
          });
        });
    });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Email or password is incorrect.'
        });
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Email or password is incorrect.'
        });
      }

      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id },
        JWT_SECRET,
        { expiresIn: '1h'}
      );

      res.status(200).json({
        expiresIn: 3600,
        token: token,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Email or password is incorrect.'
      });
    });
}

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/api/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        role: req.body.role,
        isFirstLogin: req.body.isFirstLogin
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User registered successfully',
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

module.exports = router;

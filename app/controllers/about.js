// controllers/about.js

var express = require('express'),
  router = express.Router(),
  User = require('../models/user.js');

module.exports = function (app, passport) {
  
  app.use('/', router);

};

router.get('/about', function (req, res, next) {
  res.render('about', { user: req.user });
});
// controllers/login.js

var express = require('express'),
  router = express.Router(),
  User = require('../models/user.js');

module.exports = function (app, passport) {
  
  app.use('/', router);

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

};

router.get('/login', function (req, res, next) {
  res.render('login', { message: req.flash('loginMessage')});
});
// controllers/signup.js

var express = require('express'),
  router = express.Router(),
  User = require('../models/user.js');

module.exports = function (app, passport) {

  app.use('/', router);

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

};

router.get('/signup', function (req, res, next) {
  res.render('signup', { message: req.flash('signupMessage')});
});

router.get('/loginerror', function (req, res) {
  console.log(req.flash('error'));
  res.redirect('/signup');
});

router.get('/removeusers', function (req, res, next) {
  User.remove().exec();
  User.drop();
  res.send("users removed");
});

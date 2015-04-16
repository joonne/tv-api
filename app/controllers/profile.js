// controllers/profile.js

var express = require('express'),
  router = express.Router(),
  User = require('../models/user.js');

module.exports = function (app, passport) {
  
  app.use('/', router);

};

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('profile', { user: req.user });
});

router.get('/logout', function (req, res) {
	console.log("logging out user: " + req.user)
	req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the login page
    res.redirect('/login');
}
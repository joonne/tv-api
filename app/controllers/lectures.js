// controllers/lectures.js

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/lectures', function (req, res, next) {
    res.render('lectures');
});

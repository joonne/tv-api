// controllers/guide.js

var express = require('express'),
  router = express.Router(),
  Series = require('../models/series.js');

module.exports = function (app, passport) {
  
  app.use('/', router);

};

router.get('/guide', function (req, res, next) {

	Series.find(function (err, series) {
    if (err) return next(err);
    res.render('guide', { user: req.user, series: series});
  });
});

router.get('/api/rawdata', function (req, res, next) {

	Series.find(function (err, series) {

		res.status(200).json(series);

	});
});
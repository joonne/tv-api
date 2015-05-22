// controllers/guide.js

var express = require('express'),
  router = express.Router(),
  Program = require('../models/program.js');

module.exports = function (app, passport) {

  app.use('/', router);

};

router.get('/guide', function (req, res, next) {

	Program.find(function (err, programs) {
    if (err) return next(err);
    res.render('guide', { user: req.user, programs: programs});
  });
});

router.get('/api/rawdata', function (req, res, next) {

	Program.find(function (err, programs) {

    if(programs) {
      res.status(200).json(programs);
    }

	});
});

router.get('/api/removeprograms', function (req, res, next) {
  Program.remove().exec();
  res.send("Programs removed");
});

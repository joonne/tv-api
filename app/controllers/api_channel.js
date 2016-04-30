// controllrs/api_channel.js

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Program = mongoose.model('Program')

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/channel/:channel', function (req, res, next) {

  var channel = req.params['channel'];

  Program.find({'channelName': channel}).sort({'data.start': 1 }).exec(function (err, programs) {

    if(programs) {
      res.status(200).json(programs);
    } else {
      res.status(404).json({error: 'channel not found'});
    }
  });
});

router.get('/api/rawdata', function (req, res, next) {

	Program.find({}, function (err, programs) {

    if (err) return next(err);
    res.status(200).json(programs);
	});
});

router.get('/api/config/removeprograms', function (req, res, next) {
  Program.remove().exec();
  res.send("Programs removed");
});

// controllrs/api_program.js

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Program = mongoose.model('Program'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/program/:seriesid', function (req, res, next) {

  var seriesid = req.params['seriesid'];

  console.log("Requesting tv-shows with seriesid: " + seriesid);

  Program.findOne(({'data.seriesid': seriesid}), function (err, program) {

    if(program) {
      res.status(200).json({name: program.data.name, channelName: program.channelName, start: program.data.start});
    } else {
      res.status(404).json({error: 'seriesid not found'});
    }
  });
});

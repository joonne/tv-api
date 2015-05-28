// /app.js

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  scraper = require('./app/services/scraper.js'),
  cron = require('cron');

var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

require('./config/express')(app, config);

var server = app.listen(config.port, config.ipaddr);

var cronJob = cron.job("0 */5 * * * *", function(){
	scraper.scrape();
    console.info('scraping as cron job started');
});
cronJob.start();

console.log("Listening at " + config.ipaddr + ":" + config.port);

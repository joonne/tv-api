// /app.js

'use strict';

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  scraper = require('./app/services/scraper.js'),
  cron = require('cron');

var db = mongoose.connection;
db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach((model) => {
  require(model);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.port, config.ipaddr);

var cronJob = cron.job("0 */2 * * * *", () => {
	scraper.scrape();
    console.info('scraping as cron job started');
});
cronJob.start();

console.log("Listening at " + config.ipaddr + ":" + config.port);

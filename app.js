// app.js

'use strict';

const
    express = require('express'),
    config = require('./config/config'),
    glob = require('glob'),
    mongoose = require('mongoose'),
    scraper = require('./app/services/scraper.js'),
    cron = require('cron');

const db = mongoose.connection;
db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach((model) => {
  require(model);
});

const app = express();

require('./config/express')(app, config);

app.listen(config.port, config.ip_address);

var cronJob = cron.job("0 */10 * * * *", () => {
	scraper.scrape();
    console.info('scraping as cron job started');
});
cronJob.start();

console.log("Listening at " + config.ip_address + ":" + config.port);

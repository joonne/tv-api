// app.js

const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');
const { scrape } = require('./app/services/scraper');
const cron = require('cron');

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

app.listen(config.port, config.ip_address, () => {
    console.info(`Listening at ${config.ip_address}:${config.port}`);
});

var cronJob = cron.job('0 */2 * * * *', () => {
	scrape();
    console.info('scraping as cron job started');
});
cronJob.start();

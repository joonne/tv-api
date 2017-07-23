// app.js

const express = require('express');
const config = require('./config/config');
const mongoose = require('mongoose');
const cron = require('cron');

require('./app/models/channel');
require('./app/models/program');
// const { scrape } = require('./app/services/scraper');
const { scrape } = require('./app/services/xmltv');

const db = mongoose.connection;
db.on('error', () => {
  throw new Error(`Unable to connect to database at ${config.db}`);
});

const app = express();

require('./config/express')(app, config);

app.listen(config.port, config.ip_address, () => {
  console.info(`Listening at ${config.ip_address}:${config.port}`);
});

const cronJob = cron.job('0 */2 * * * *', () => {
  scrape();
});
cronJob.start();

scrape();

module.exports = app;

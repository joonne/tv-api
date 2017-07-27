// app.js

const express = require('express');
const config = require('./config/config');
const cron = require('cron');

const { updateSchedule } = require('./app/services/xmltv');

const app = express();

require('./config/express')(app, config);

app.listen(config.port, config.ip_address, () => {
  console.info(`Listening at ${config.ip_address}:${config.port}`);
});

const cronJob = cron.job('0 */2 * * * *', () => {
  updateSchedule();
});
cronJob.start();

updateSchedule();

module.exports = app;

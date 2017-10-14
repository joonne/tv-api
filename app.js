// app.js

const http = require('http');
const cron = require('cron');

const { updateAll } = require('./app/services/xmltv');

const config = require('./config/config');
const router = require('./app/router');
const logger = require('./app/helpers/logger');
const mongo = require('./app/helpers/mongo');

const countries = require('./app/data/countries.json');

mongo.getDb
  .then(db => db.collection('countries').deleteMany({}))
  .then(() => mongo.getDb)
  .then(db => db.collection('countries').insertMany(countries))
  .then(updateAll)
  .catch((err) => {
    console.log(err.stack);
  });

const server = http.createServer(logger(router));

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(config.port, config.ip_address, undefined, () => {
  console.log(`listening at ${config.ip_address}:${config.port}`);
});

// 6 AM
cron.job('0 6 * * *', () => updateAll()).start();

// graceful shutdown when interrupted (ctrl-c)
process.on('SIGINT', () => {
  process.exit();
});

// graceful shutdown when the process is killed
process.on('SIGTERM', () => {
  process.exit();
});

module.exports = server;

// app.js

const http = require('http');
const cron = require('cron');

const { updateAll } = require('./app/services/xmltv');

const { port, ip, env } = require('./config/config');
const router = require('./app/router');
const logger = require('./app/helpers/logger');
const mongo = require('./app/helpers/mongo');

const countries = require('./app/data/countries.json');

(async () => {
  try {
    const db = await mongo.db;
    await db.collection('countries').deleteMany({});
    await db.collection('countries').insertMany(countries);
    if (env !== 'test') await updateAll();
  } catch (error) {
    console.log(error.stack);
  }
})();

const server = http.createServer(env === 'test' ? router : logger(router));

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(port, ip, undefined, () => {
  console.log(`listening at ${ip}:${port}`);
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

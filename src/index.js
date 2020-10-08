const cron = require('cron');

const { updateAll } = require('./services/xmltv');
const { port, ip, env } = require('./config/config');
const server = require('./router');
const mongo = require('./helpers/mongo');
const { getChannels } = require('./controllers/channels');

const countries = require('./data/countries.json');

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

const app = server();

if (!module.parent) {
  app.listen(port, ip, () => {
    console.log(`listening at ${ip}:${port}`);
  });
}

app.get('/api/channels', getChannels);

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

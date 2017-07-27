// config/express.js

const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');

const routes = require('../app/routes');
const channels = require('./channels.json');
const mongo = require('../app/helpers/mongo');

module.exports = (app) => {
  // init db
  if (process.env.NODE_ENV !== 'test') {
    mongo.getDb
      .then(db => db.collection('channels').find({}).toArray())
      .then((results) => {
        if (!results.length) {
          channels.forEach((ch) => {
            const channel = {
              name: ch.name,
              orderNumber: ch.orderNumber,
              // telsuId: ch.telsuId,
              _id: ch.xmltvId,
            };
            mongo.getDb.then(db => db.collection('channels').insertOne(channel));
          });
        }
      });
  }

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(compress());
  app.use(methodOverride());

  // secure HTTP headers with helmet
  app.use(helmet());

  app.use(routes);

  app.use((req, res) => res.status(404).send('Not Found'));

  app.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500);
    return res.json({
      message: err.message,
    });
  });

  // graceful shutdown when interrupted (ctrl-c)
  process.on('SIGINT', () => {
    process.exit();
  });

  // graceful shutdown when the process is killed
  process.on('SIGTERM', () => {
    process.exit();
  });
};

// config/express.js

const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const helmet = require('helmet');

const routes = require('../app/routes');
const Channel = require('../app/models/channel');
const channels = require('./channels.json');

module.exports = (app, config) => {
  // init mongoose & declare promise library to be used
  mongoose.Promise = Promise;
  mongoose.connect(config.db);

  // init db
  if (process.env.NODE_ENV !== 'test') {
    Channel.find().then((results) => {
      if (!results.length) {
        channels.forEach((channel) => {
          const newChannel = new Channel({
            name: channel.name,
            orderNumber: channel.orderNumber,
            telsuId: channel.telsuId,
            xmltvId: channel.xmltvId,
          });
          newChannel.save();
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
    mongoose.connection.close(() => {
      process.exit();
    });
  });

  // graceful shutdown when the process is killed
  process.on('SIGTERM', () => {
    mongoose.connection.close(() => {
      process.exit();
    });
  });
};

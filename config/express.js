// config/express.js

const
    express = require('express'),
    glob = require('glob'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');

module.exports = (app, config) => {

  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  mongoose.connect(config.db);

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compress());
  app.use('/public', express.static(config.root + '/public'));
  app.use(methodOverride());
  app.use(cookieParser());

  const controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });
};

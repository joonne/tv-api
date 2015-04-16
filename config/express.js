// config/express.js

var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');


module.exports = function(app, config) {
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  require('./passport')(passport);
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

  // passport related stuff
  app.use(session({ secret: 'secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app,passport);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  app.get('/logout', function(req, res) {
    var name = req.user.username;
    console.log("LOGGING OUT " + name);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name;
  });

};

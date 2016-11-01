// config/express.js

const express = require('express');
const glob = require('glob');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const helmet = require('helmet');
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
                const promises = channels.map(name => new Channel({ name }).save());
                Promise.all(promises);
            }
        });
    }

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(compress());
    app.use('/public', express.static(`${config.root}/public`));
    app.use(methodOverride());
    app.use(cookieParser());

    // secure HTTP headers with helmet
    app.use(helmet());

    const controllers = glob.sync(`${config.root}/app/controllers/*.js`);
    controllers.forEach((controller) => {
        require(controller)(app); // eslint-disable-line global-require
    });

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

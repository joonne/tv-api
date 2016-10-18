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

module.exports = (app, config) => {
    mongoose.connect(config.db);

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

    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use((err, req, res) => {
        res.status(err.status || 500);
        return res.status(500).json({
            message: err.message,
            error: {},
            title: 'error',
        });
    });
};

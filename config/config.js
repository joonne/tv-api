// config/config.js

const path = require('path');

const rootPath = path.join(__dirname, '/..');
const env = process.env.NODE_ENV || 'development';
const port = env.NODEJS_PORT || 10010;
const serverIpAddress = env.NODEJS_IP || '127.0.0.1';
const name = 'tv-api';
let mongodbConnectionString = `mongodb://127.0.0.1:27017/${name}`;

// let mongodbConnectionString =
//     'mongodb://heroku_b68w34dd:sf4v184jp3fs4gdg38l607aabo@ds035016.mlab.com:35016/heroku_b68w34dd';

// take advantage of openshift env vars when available:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL;
}

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    mongodbConnectionString = `${process.env.OPENSHIFT_MONGODB_DB_USERNAME}:${process.env.OPENSHIFT_MONGODB_DB_PASSWORD}@${process.env.OPENSHIFT_MONGODB_DB_HOST}:${process.env.OPENSHIFT_MONGODB_DB_PORT}/${process.env.OPENSHIFT_APP_NAME}`; // eslint-disable-line
}

module.exports = {
    root: rootPath,
    app: {
        name,
    },
    port,
    ip_address: serverIpAddress,
    db: mongodbConnectionString,
};

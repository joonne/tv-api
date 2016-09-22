// config/config.js

const path = require('path');

const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';
const port = env.NODEJS_PORT || 10010;
const server_ip_address = env.NODEJS_IP || '127.0.0.1';
const name = 'tv-api';
const mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + name;

// take advantage of openshift env vars when available:
if (process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL;
}

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

module.exports = {
    root: rootPath,
    app: {
      name: name
    },
    port: port,
    ip_address: server_ip_address,
    db: mongodb_connection_string
};

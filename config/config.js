// config/config.js

const
    path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    port = env.NODEJS_PORT || 10010,
    server_ip_address = env.NODEJS_IP || '127.0.0.1',
    name = "tv-api",
    mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + name;

//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL;
}

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

const config = {
    root: rootPath,
    app: {
      name: name
    },
    port: port,
    ip_address: server_ip_address,
    db: mongodb_connection_string,
    secret: 'surveillancesecretSshSsh'
};

module.exports = config;

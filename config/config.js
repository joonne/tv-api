// config/config.js

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var db_name = "tv-api";

var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;

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

// mongodb_connection_string = 'mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/';
// Root User:     admin
// Root Password: 9sImnPSt4kFg
// Database Name: tvapi
// Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'tvapi'
    },
    port: port,
    ipaddr: server_ip_address,
    db: mongodb_connection_string
  },

  test: {
    root: rootPath,
    app: {
      name: 'tvapi'
    },
    port: port,
    ipaddr: server_ip_address,
    db: mongodb_connection_string
  },

  production: {
    root: rootPath,
    app: {
      name: 'tvapi'
    },
    port: port,
    ipaddr: server_ip_address,
    db: mongodb_connection_string
  }
};

module.exports = config[env];

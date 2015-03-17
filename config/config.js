var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var port = process.env.OPENSHIFT_NODEJS_PORT; // || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP; // || '127.0.0.1';

var mongodb_connection_string; // = 'mongodb://127.0.0.1:27017/';
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL;
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
    db: mongodb_connection_string + 'tvapi-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'tvapi'
    },
    port: port,
    db: mongodb_connection_string + 'tvapi-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'tvapi'
    },
    port: port,
    db: mongodb_connection_string + 'tvapi-production'
  }
};

module.exports = config[env];

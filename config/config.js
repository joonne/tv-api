var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'yoexpressmvc'
    },
    port: 3000,
    db: 'mongodb://localhost/yoexpressmvc-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'yoexpressmvc'
    },
    port: 3000,
    db: 'mongodb://localhost/yoexpressmvc-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'yoexpressmvc'
    },
    port: 3000,
    db: 'mongodb://localhost/yoexpressmvc-production'
  }
};

module.exports = config[env];

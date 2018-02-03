// config/config.js

const path = require('path');

const rootPath = path.join(__dirname, '/..');
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const serverIpAddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const name = 'tv-api';
const mongoURL = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/${name}`;

module.exports = {
  root: rootPath,
  app: {
    name,
  },
  port,
  ip_address: serverIpAddress,
  db: mongoURL,
};

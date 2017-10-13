// config/config.js

const path = require('path');

const rootPath = path.join(__dirname, '/..');
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 10010;
const serverIpAddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const name = 'tv-api';
const mongoURL = process.env.MONGO_URL || process.env.OPENSHIFT_MONGODB_DB_URL || `mongodb://127.0.0.1:27017/${name}`;

// if (process.env.DATABASE_SERVICE_NAME) {
//   const mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
//   const mongoHost = process.env[`${mongoServiceName}_SERVICE_HOST`];
//   const mongoPort = process.env[`${mongoServiceName}_SERVICE_PORT`];
//   const mongoDatabase = process.env[`${mongoServiceName}_DATABASE`];
//   const mongoPassword = process.env[`${mongoServiceName}_PASSWORD`];
//   const mongoUser = process.env[`${mongoServiceName}_USER`];

//   if (mongoHost && mongoPort && mongoDatabase) {
//     if (mongoUser && mongoPassword) {
//       mongoURL += `${mongoUser}:${mongoPassword}@`;
//     }
//     mongoURL += `${mongoHost}:${mongoPort}/${mongoDatabase}`;
//   }
// }

module.exports = {
  root: rootPath,
  app: {
    name,
  },
  port,
  ip_address: serverIpAddress,
  db: mongoURL,
};

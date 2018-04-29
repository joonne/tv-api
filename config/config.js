// config/config.js

const port = process.env.PORT || 10010;
const ip = process.env.IP || '0.0.0.0';
const name = 'tv-api';
const db = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/${name}`;
const env = process.env.NODE_ENV;

module.exports = {
  name,
  port,
  ip,
  db,
  env,
};

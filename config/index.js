// config/index.js

const getEnv = (key, required = true, defaultValue) => {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Required env variable ${key} missing.`);
  }

  return value || defaultValue;
};

module.exports = {
  name: 'tv-api',
  port: getEnv('PORT', false, 10010),
  ip: getEnv('IP', false, '0.0.0.0'),
  db: getEnv('MONGO_URL', false, `mongodb://127.0.0.1:27017/${this.name}`),
  env: getEnv('NODE_ENV', false),
};

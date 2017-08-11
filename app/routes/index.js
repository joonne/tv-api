// app/routes/index.js

const url = require('url');

const { getChannels } = require('../controllers/channels');
const { getProgramsByChannel } = require('../controllers/programs');
const { getHealth } = require('../controllers/health.js');

const routes = (req, res) => {
  const pathname = url.parse(req.url, true).pathname;
  if (pathname === '/api/channels' && req.method === 'GET') {
    return getChannels(req, res);
  } else if (pathname.match('^/api/channels/.{1,}/programs$') && req.method === 'GET') {
    return getProgramsByChannel(req, res);
  } else if (pathname === '/health' && req.method === 'GET') {
    return getHealth(req, res);
  }
  res.statusCode = 404;
  return res.end('Not Found');
};

module.exports = routes;

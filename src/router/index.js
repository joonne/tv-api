// app/routes/index.js

const http = require('http');
const url = require('url');

const cors = require('../helpers/cors');
const logger = require('../helpers/logger');
const extendResponse = require('../helpers/response');
const { getChannels } = require('../controllers/channels');
const { getProgramsByChannel } = require('../controllers/programs');
const { getHealth } = require('../controllers/health');
const { getCountries } = require('../controllers/countries');

const Router = () => {
  const routes = [];

  // if (pathname === '/api/channels' && req.method === 'GET') {
  //   return getChannels(req, res);
  // }

  // if (pathname.match('^/api/channels/.{1,}/programs$') && req.method === 'GET') {
  //   return getProgramsByChannel(req, res);
  // }

  // if (pathname === '/health' && req.method === 'GET') {
  //   return getHealth(req, res);
  // }

  // if (pathname === '/api/countries' && req.method === 'GET') {
  //   return getCountries(req, res);
  // }

  // return res.status(404).end('Not Found');

  const matches = (req, path) => {
    const { pathname, query } = url.parse(req.url, true);

    if (path === pathname) {
      return { match: true, query };
    }

    // get path params
    // match base path

    return { match: false };
  };

  return {
    create(req, res) {
      const route = routes.find((r) => matches(req, r.path).match && r.method === req.method);
      return route.handler(req, res);
    },
    register(path, handler, method) {
      routes.push({ path, handler, method });
      console.log(path, handler);
    },
  };
};

function Server() {
  const router = Router();
  const server = http.createServer(logger(cors(extendResponse(router.create))));

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  return {
    get(path, handler) {
      router.register(path, handler, 'GET');
    },
    listen(port, ip, cb) {
      server.listen(port, ip, undefined, cb);
    },
  };
}

module.exports = Server;

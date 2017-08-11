// controllers/channels.js

const mongo = require('../helpers/mongo');
const url = require('url');

const { handleErrors } = require('../helpers/errors');

function getChannels(req, res) {
  const country = url.parse(req.url, true).query.country;
  const query = {};
  if (country) {
    query.country = country;
  }
  return mongo.getDb
    .then(db => db.collection('channels').find(query).sort({ orderNumber: 1 }).toArray())
    .then((channels) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(channels));
    })
    .catch(error => handleErrors(res, error));
}

module.exports = {
  getChannels,
};

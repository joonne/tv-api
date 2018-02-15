// controllers/channels.js

const mongo = require('../helpers/mongo');
const url = require('url');

const { handleErrors } = require('../helpers/errors');

async function getChannels(req, res) {
  const country = url.parse(req.url, true).query.country;
  const query = {};

  if (country) {
    query.country = country;
  }

  try {
    const db = await mongo.getDb;
    const channels = await db.collection('channels').find(query).sort({ orderNumber: 1 }).toArray();

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    return res.end(JSON.stringify(channels));
  } catch (error) {
    return handleErrors(res, error);
  }
}

module.exports = {
  getChannels,
};

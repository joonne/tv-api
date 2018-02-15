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
    const channelsWithoutOrderNumber = await db.collection('channels').find({ ...query, orderNumber: null }).toArray();
    const channelsWithOrderNumber = await db.collection('channels').find({ ...query, orderNumber: { $ne: null } }).sort({ orderNumber: 1 }).toArray();

    const channels = channelsWithOrderNumber.concat(channelsWithoutOrderNumber);

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

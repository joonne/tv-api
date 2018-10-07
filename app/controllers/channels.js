// controllers/channels.js

const url = require('url');
const mongo = require('../helpers/mongo');

const { handleErrors } = require('../helpers/errors');

async function getChannels(req, res) {
  const { country } = url.parse(req.url, true).query;
  const query = {};

  if (country) {
    query.country = country;
  }

  try {
    const db = await mongo.db;
    const channelsWithoutOrderNumber = await db.collection('channels').find({ ...query, orderNumber: null }).toArray();
    const channelsWithOrderNumber = await db.collection('channels').find({ ...query, orderNumber: { $ne: null } }).sort({ orderNumber: 1 }).toArray();

    const channels = channelsWithOrderNumber.concat(channelsWithoutOrderNumber);

    return res.status(200).json(channels);
  } catch (error) {
    return handleErrors(res, error);
  }
}

module.exports = {
  getChannels,
};

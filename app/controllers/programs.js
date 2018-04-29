// app/controllers/programs.js

const mongo = require('../helpers/mongo');
const url = require('url');

const { handleErrors } = require('../helpers/errors');

async function getProgramsByChannel(req, res) {
  const startString = 'channels/';
  const endString = '/programs';
  const pathname = url.parse(req.url).pathname;
  const start = pathname.indexOf(startString) + startString.length;
  const end = pathname.indexOf(endString);
  const _channelId = pathname.slice(start, end);

  try {
    const db = await mongo.db;
    const programs = await db.collection('programs').find({ _channelId }).sort({ 'data.start': 1 }).toArray();

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    return res.end(JSON.stringify(programs));
  } catch (error) {
    return handleErrors(res, error);
  }
}

module.exports = {
  getProgramsByChannel,
};

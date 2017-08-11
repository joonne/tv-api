// app/controllers/program.js

const mongo = require('../helpers/mongo');
const url = require('url');

const { handleErrors } = require('../helpers/errors');

function getProgramsByChannel(req, res) {
  const startString = 'channels/';
  const endString = '/programs';
  const pathname = url.parse(req.url).pathname;
  const start = pathname.indexOf(startString) + startString.length;
  const end = pathname.indexOf(endString);
  const _channelId = pathname.slice(start, end);

  return mongo.getDb
    .then(db => db.collection('programs').find({ _channelId }).sort({ 'data.start': 1 }).toArray())
    .then((programs) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(programs));
    })
    .catch(error => handleErrors(res, error));
}

module.exports = {
  getProgramsByChannel,
};

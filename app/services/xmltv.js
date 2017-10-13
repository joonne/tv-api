const moment = require('moment-timezone');

const http = require('../helpers/http');
const mongo = require('../helpers/mongo');

const baseUrl = 'https://json.xmltv.se';
const dateString = moment().tz('Europe/Helsinki').format('YYYY-MM-DD');

/* xmltv_ns: This is intended to be a general way to number episodes and
parts of multi-part episodes.  It is three numbers separated by dots,
the first is the series or season, the second the episode number
within that series, and the third the part number, if the programme is
part of a two-parter.  All these numbers are indexed from zero, and
they can be given in the form 'X/Y' to show series X out of Y series
made, or episode X out of Y episodes in this series, or part X of a
Y-part episode.  If any of these aren't known they can be omitted.
You can put spaces whereever you like to make things easier to read. */

const getEpisodeNumber = (str) => {
  const parts = str.split('.');
  if (!parts.length) {
    return '-';
  }
  const episodeStr = parts[1].trim();
  const episode = episodeStr.includes('/') ? episodeStr.split('/')[0].trim() : episodeStr.trim();
  return parseInt(episode, 10) + 1;
};

const getSeasonNumber = (str) => {
  const parts = str.split('.');
  if (!parts.length) {
    return '-';
  }
  const seasonStr = parts[0].trim();
  const season = seasonStr.includes('/') ? seasonStr.split('/')[0].trim() : seasonStr.trim();
  return parseInt(season, 10) + 1;
};

const getTitleOrDesc = (obj) => {
  let key;
  try {
    key = Object.keys(obj)[0];
  } catch (error) {
    key = null;
  }
  return obj && key ? obj[key] : '';
};

const insertPrograms = (data, _channelId) => {
  const programs = data.jsontv.programme.map(p => ({
    _channelId,
    data: {
      name: getTitleOrDesc(p.title),
      description: getTitleOrDesc(p.desc),
      season: p.episodeNum && p.episodeNum.xmltv_ns ? getSeasonNumber(p.episodeNum.xmltv_ns) : '-',
      episode: p.episodeNum && p.episodeNum.xmltv_ns ? getEpisodeNumber(p.episodeNum.xmltv_ns) : '-',
      start: p.start ? parseInt(p.start, 10) : '-',
      end: p.stop ? parseInt(p.stop, 10) : '-',
    },
  }));

  // bulk insert fails if array is empty
  if (!programs.length) {
    return;
  }

  mongo.getDb
    .then(db => db.collection('programs').insertMany(programs));
};

function updateSchedule() {
  return mongo.getDb
    .then(db => db.collection('programs').deleteMany({}))
    .then(() => mongo.getDb)
    .then(db => db.collection('channels').find({ country: 'fi' }).toArray())
    .then((channels) => {
      const promises =
        channels.map(channel => http.get(`${baseUrl}/${channel._id}_${dateString}.js.gz`));

      return Promise.all(promises)
        .then((results) => {
          results.forEach((channel, index) => {
            insertPrograms(channel, channels[index]._id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
}

function updateChannels() {
  return mongo.getDb
    .then(db => db.collection('countries').find({}).toArray())
    .then((countries) => {
      const promises =
        countries.map(country => http.get(`${baseUrl}/channels-${country.name}.js.gz`));

      return Promise.all(promises)
        .then((result) => {
          const channelsOrig = result.jsontv.channels;
          const channels = Object.keys(channelsOrig).map(channelId => ({
            name: channelsOrig[channelId].displayName.en,
            icon: channelsOrig[channelId].icon,
            _id: channelId,
            country: channelId.slice(channelId.lastIndexOf('.') + 1),
          }));

          return mongo.getDb
            .then(db => db.collection('channels').deleteMany({}))
            .then(() => mongo.getDb)
            .then(db => db.collection('channels').insertMany(channels));
        });
    });
}

const updateAll = () => updateChannels()
  .then(() => console.log('Channels updated'))
  // .then(() => updateSchedule())
  // .then(() => console.log('Programs updated'));

module.exports = {
  updateSchedule,
  updateChannels,
  getEpisodeNumber,
  getSeasonNumber,
  updateAll,
};

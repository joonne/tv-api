const rp = require('request-promise');
const moment = require('moment-timezone');

const Channel = require('../models/channel');
const Program = require('../models/program');

const { searchSeasonNumber, searchEpisodeNumber } = require('./scraper');

const baseUrl = 'http://json.xmltv.se';

const dateString = moment().tz('Europe/Helsinki').format('YYYY-MM-DD');

const language = 'fi';

const parseResponses = (responses) => {
  let parsed;
  try {
    parsed = responses.map(response => JSON.parse(response));
  } catch (error) {
    parsed = [];
  }
  return parsed;
};

const processBaseInformation = (data, _channelId) => {
  data.jsontv.programme.forEach((p) => {
    const program = {
      name: p.title && p.title[language] ? p.title[language] : '',
      description: p.desc && p.desc[language] ? p.desc[language] : '',
      season: p.episodeNum && p.episodeNum.onscreen ? searchSeasonNumber(p.episodeNum.onscreen) : '-',
      episode: p.episodeNum && p.episodeNum.onscreen ? searchEpisodeNumber(p.episodeNum.onscreen) : '-',
      start: p.start ? p.start : '-',
      end: p.stop ? p.stop : '-',
    };

    const newProgram = new Program({
      _channelId,
      data: program,
    });

    newProgram.save((err) => {
      if (err) throw err;
    });
  });
};

const scrape = () => {
  Program.remove().exec();

  Channel
    .find()
    .sort({ orderNumber: 1 })
    .then((channels) => {
      const promises =
        channels.map(channel => rp(`${baseUrl}/${channel.xmltvId}.${language}_${dateString}.js.gz`));

      Promise.all(promises)
        .then(parseResponses)
        .then(results => results.forEach((channel, index) => {
          processBaseInformation(channel, channels[index]._id);
        }))
        .catch((err) => {
          console.log(err);
        });
    });
};

module.exports = {
  scrape,
};

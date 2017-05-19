const rp = require('request-promise');
const get = require('lodash.get');
const range = require('lodash.range');
const parse = require('xml-parser');

const {
  searchSeasonNumber,
  searchEpisodeNumber,
} = require('./scraper');

// const Program = require('../models/program');

const searchChannelName = str => str.slice(str.indexOf(' ') + 1);
const searchProgramName = str => str.slice(str.indexOf(' ') + 1);
const searchStartTime = str => str.slice(0, str.indexOf(' '));

const channelNumbers = range(3, 5);

const promises = channelNumbers.map(channel => rp(`http://telkussa.fi/RSS/Channel/${channel}`));

Promise.all(promises)
  .then((results) => {
    const objects = results.map(result => parse(result));
    return objects.map((object) => {
      const channelName = get(object, 'root.children[0].children[0].content', '');
      return get(object, 'root.children[0].children', [])
        .filter(child => child.name === 'item')
        .map(item => ({
          channelName: searchChannelName(channelName),
          name: searchProgramName(item.children[0].content),
          description: item.children[1].content,
          start: searchStartTime(item.children[0].content),
          season: searchSeasonNumber(item.children[1].content),
          episode: searchEpisodeNumber(item.children[1].content),
        }));
    });
  })
  .then((channels) => {
    console.log(channels);
  });

// async function getResults(channels) {
//   const promises = channels.map(channel => rp(`http://telkussa.fi/RSS/Channel/${channel}`));
//   const programs = await Promise.all(promises).then((results) => {
//     const objects = results.map(result => parse(result));
//     return objects.map(object => object.root.children[0].children
//       .filter(child => child.name === 'item')
//       .map(item => ({
//         [item.children[0].name]: item.children[0].content,
//         [item.children[1].name]: item.children[1].content,
//       })));
//   });
//   return programs;
// }

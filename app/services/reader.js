// const Program = require('../models/program');
// const Channel = require('../models/channel');
const rp = require('request-promise');
// const moment = require('moment-timezone');
const _ = require('lodash');
const parse = require('xml-parser');

const channels = _.range(1, 44);

const promises = channels.map(channel => rp(`http://telkussa.fi/RSS/Channel/${channel}`));

const programs = Promise.all(promises).then((results) => {
  const objects = results.map(result => parse(result));
  return objects.map(object => object.root.children[0].children
    .filter(child => child.name === 'item')
    .map(item => ({
      [item.children[0].name]: item.children[0].content,
      [item.children[1].name]: item.children[1].content,
    })));
});

console.log(programs);

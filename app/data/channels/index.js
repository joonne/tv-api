// data/countries/index.js
//
// this file includes all the available country specific channel order files
//

const channelsByCountry = {};

const countries = require('../countries.json');

const generateChannelsByCountry = () => {
  if (!Array.isArray(countries)) {
    return;
  }

  countries.forEach((country) => {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const channels = require(`./${country.abbreviation}.json`);

      const channelsReduced = channels.reduce((acc, curr) => {
        acc[curr._channelId] = curr.orderNumber;
        return acc;
      }, {});

      channelsByCountry[country.abbreviation] = channelsReduced;
    } catch (error) {
      console.error(`${country.abbreviation}.json not found`);
    }
  });
};

generateChannelsByCountry();

module.exports = { channelsByCountry };

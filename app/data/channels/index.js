// data/countries/index.js
//
// this file includes all the available country specific channel order files
//

const countries = require('../countries.json');

const generateChannelsByCountry = () => {
  if (!Array.isArray(countries)) {
    return {};
  }

  return countries.reduce((channelsByCountry, country) => {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const channels = require(`./${country.abbreviation}.json`);

      return {
        ...channelsByCountry,
        [country.abbreviation]: channels.reduce((channelsReduced, channel) => ({
          ...channelsReduced,
          [channel._channelId]: channel.orderNumber,
        }), {}),
      };
    } catch (error) {
      console.error(`${country.abbreviation}.json not found`);
      return channelsByCountry;
    }
  }, {});
};

module.exports = { channelsByCountry: generateChannelsByCountry() };

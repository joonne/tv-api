const cheerio = require('cheerio');
const events = require('events');
const Program = require('../models/program');
const Channel = require('../models/channel');
const rp = require('request-promise');
const moment = require('moment-timezone');
const _ = require('lodash');

const eventEmitter = new events.EventEmitter();

// We need finnish localization
moment.locale('fi');

let channels = [];

const descriptions = [];
const names = [];
const seasons = [];
const episodes = [];
const starts = [];
const ends = [];
const allPrograms = [];

function searchSeasonNumber(description) {
    const start = description.indexOf('Kausi');
    let seasonNumber = '-';

    if (description.charAt(start + 7) === ',') {
        seasonNumber = description.substr(start + 6, 1);
    } else if (description.charAt(start + 8) === ',') {
        seasonNumber = description.substr(start + 6, 2);
    } else if (description.charAt(start + 7) === '.') {
        seasonNumber = description.substr(start + 6, 1);
    } else if (description.charAt(start + 8) === '.') {
        seasonNumber = description.substr(start + 6, 2);
    }
    return Number.isNaN(seasonNumber / 1) ? '-' : seasonNumber;
}

function searchEpisodeNumber(description) {
    let start = 0;
    let episodeNumber = '-';

    description = description.toLowerCase();

    if (description.indexOf('jakso') !== -1 && description.charAt(description.indexOf('jakso') + 5) === ' ') {
        start = description.indexOf('jakso');

        if (description.charAt(start + 7) === '/') {
            episodeNumber = description.substr(start + 6, 1);
        } else if (description.charAt(start + 8) === '/') {
            episodeNumber = description.substr(start + 6, 2);
        } else if (description.charAt(start + 7) === '.') {
            episodeNumber = description.substr(start + 6, 1);
        } else if (description.charAt(start + 8) === '.') {
            episodeNumber = description.substr(start + 6, 2);
        }
    } else if (description.indexOf('osa') !== -1 && description.charAt(description.indexOf('osa') + 3) === ' ') {
        start = description.indexOf('osa');

        if (description.charAt(start + 5) === '.') {
            episodeNumber = description.substr(start + 4, 1);
        } else if (description.charAt(start + 6) === '.') {
            episodeNumber = description.substr(start + 4, 2);
        } else if (description.indexOf(':') !== -1) {
            const end = description.indexOf(':');
            episodeNumber = description.substr(start + 4, end - (start + 4));
        }
    } else if (description.indexOf('kausi') !== -1) {
        start = description.indexOf('kausi');

        if (description.charAt(start + 10) === '/') {
            episodeNumber = description.substr(start + 9, 1);
        } else if (description.charAt(start + 11 === '/')) {
            episodeNumber = description.substr(start + 9, 2);
        }
    }
    return Number.isNaN(episodeNumber / 1) ? '-' : episodeNumber;
}

function searchProgramName(summary) {
    let name = summary;
    const start = summary.indexOf('(');

    if (start !== -1) {
        name = summary.substr(0, start - 1);
    }
    return name;
}

function formatDate(dateString) {
    return moment.tz(dateString, 'YYYY-MM-DD hh:mm', 'Europe/Helsinki').format();
}

// Gets information for every channel
function processBaseInformation(body, channelName) {
    descriptions.length = 0;
    names.length = 0;
    seasons.length = 0;
    episodes.length = 0;
    starts.length = 0;
    ends.length = 0;

    const $ = cheerio.load(body);

    $('.atc_title').each((i, elem) => {
        const summary = _.get(elem, 'children[0].data', '');
        names[i] = searchProgramName(summary);
    });

    $('.atc_description').each((i, elem) => {
        const description = _.get(elem, 'children[0].data');

        if (description.length === 0) {
            descriptions[i] = 'Ei kuvausta saatavilla.';
            seasons[i] = '-';
            episodes[i] = '-';
        } else {
            descriptions[i] = description;
            seasons[i] = searchSeasonNumber(description);
            episodes[i] = searchEpisodeNumber(description);
        }
    });

    $('.atc_date_start').each((i, elem) => {
        const start = _.get(elem, 'children[0].data', '');
        starts[i] = start.length ? formatDate(start) : '';
    });

    $('.atc_date_end').each((i, elem) => {
        const end = _.get(elem, 'children[0].data', '');
        ends[i] = end.length ? formatDate(end) : '';
    });

    const programs = [];

    // this combines information to JSON
    const programCount = names.length;
    for (let i = 0; i < programCount; i += 1) {
        const name = names[i];
        const description = descriptions[i];
        const season = seasons[i];
        const episode = episodes[i];
        const start = starts[i];
        const end = ends[i];

        const program = {
            name,
            description,
            season,
            episode,
            start,
            end,
        };

        programs.push(program);

        const newProgram = new Program({
            channelName,
            data: program,
        });

        newProgram.save((err) => {
            if (err) throw err;
        });
    }

    const temp = {
        channelName,
        data: programs,
    };

    allPrograms.push(temp);

    if (allPrograms.length === channels.length) {
        eventEmitter.emit('base_finished');
    }
}

function scrape() {
    allPrograms.length = 0;
    descriptions.length = 0;
    names.length = 0;
    seasons.length = 0;
    episodes.length = 0;
    starts.length = 0;
    ends.length = 0;

    // FIXME
    Program.remove().exec();

    const today = moment().tz('Europe/Helsinki').format('dddd');

    Channel.find().select({ name: 1, _id: 0 }).sort()
        .then(result => result.map(channel => channel.name))
        .then((channelArr) => {
            channels = channelArr;
            const promises = channels.map(channel => rp(`http://www.telsu.fi/${today}/${channel}`));

            Promise.all(promises).then((results) => {
                results.forEach((channel, index) => {
                    processBaseInformation(channel, channels[index]);
                });
            });
        });
}

module.exports = {
    searchSeasonNumber,
    searchEpisodeNumber,
    searchProgramName,
    formatDate,
    scrape,
};

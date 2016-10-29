const cheerio = require('cheerio');
const events = require('events');
const Program = require('../models/program');
const rp = require('request-promise');
const moment = require('moment-timezone');

const eventEmitter = new events.EventEmitter();

// We need finnish localization
moment.locale('fi');

const channels = ['yle1', 'yle2', 'mtv3', 'nelonen', 'subtv', 'liv', 'jim', 'viisi', 'kutonen', 'fox', 'ava', 'hero'];

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

    if (description.indexOf('jakso') !== -1) {
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
    } else if (description.indexOf('osa') !== -1) {
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
    return moment(dateString, 'DD/MM/YYYY hh:mm').format();
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

    $('._summary').each((i, elem) => {
        const summary = elem.children[0].data;
        names[i] = searchProgramName(summary);
    });

    $('._description').each((i, elem) => {
        const description = elem.children.length > 0 ? elem.children[0].data : '';

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

    $('._start').each((i, elem) => {
        starts[i] = elem.children.length > 0 ? formatDate(elem.children[0].data) : '';
    });

    $('._end').each((i, elem) => {
        ends[i] = elem.children.length > 0 ? formatDate(elem.children[0].data) : '';
    });

    const programs = [];

    // this combines information to JSON
    for (let i = 0; i < names.length; i += 1) {
        const name = names[i];
        const description = descriptions[i];
        const season = seasons[i];
        const episode = episodes[i];
        const start = starts[i];
        const end = ends[i];

        const temp = {
            name,
            description,
            season,
            episode,
            start,
            end,
        };

        programs.push(temp);

        const newProgram = new Program({
            channelName,
            data: temp,
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

    Program.remove().exec();

    const today = moment().tz('Europe/Helsinki').format('dddd');

    const promises = [];

    channels.forEach((channel) => {
        promises.push(rp(`http://www.telsu.fi/${today}/${channel}`));
    });

    Promise.all(promises).then((results) => {
        results.forEach((channel, index) => {
            processBaseInformation(channel, channels[index]);
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

const cheerio = require('cheerio');
const events = require('events');
const Program = require('../models/program');
const rp = require('request-promise');
const moment = require('moment-timezone');

const eventEmitter = new events.EventEmitter();

// We need finnish localization
moment.locale('fi');

const channels = ['yle1', 'yle2', 'mtv3', 'nelonen', 'subtv', 'liv', 'jim', 'viisi', 'kutonen', 'fox', 'ava', 'hero'];
// const channels = ['yle1'];

const descriptions = [];
const names = [];
const seasons = [];
const episodes = [];
const starts = [];
const ends = [];
const allPrograms = [];

function searchSeasonNumber(description) {
    const start = description.indexOf('Kausi');
    let seasonNumber = 0;

    if (description.charAt(start + 8) !== '.') {
        seasonNumber = description.substr(start + 6, 1);
    } else {
        seasonNumber = description.substr(start + 6, 2);
    }
    return isNaN(seasonNumber / 1) ? '-' : seasonNumber;
}

function searchEpisodeNumber(description) {
    let start = 0;
    let episodeNumber = 0;

    if (description.indexOf('Jakso') !== -1) {
        start = description.indexOf('Jakso');

        if (description.charAt(start + 8) !== '/') {
            episodeNumber = description.substr(start + 6, 1);
        } else if (description.charAt(start + 8 === '/')) {
            episodeNumber = description.substr(start + 6, 2);
        }

        return isNaN(episodeNumber / 1) ? '-' : episodeNumber;
    } else if (description.indexOf('jakso') !== -1) {
        start = description.indexOf('jakso');

        if (description.charAt(start + 8) !== '/') {
            episodeNumber = description.substr(start + 6, 1);
        } else if (description.charAt(start + 8 === '/')) {
            episodeNumber = description.substr(start + 6, 2);
        }

        return isNaN(episodeNumber / 1) ? '-' : episodeNumber;
    } else if (description.indexOf('osa') !== -1) {
        console.log('osa found'); // eslint-disable-line
    } else {
        start = description.indexOf('Kausi');

        if (description.charAt(start + 11) !== '/') {
            episodeNumber = description.substr(start + 9, 1);
        } else if (description.charAt(start + 11 === '/')) {
            episodeNumber = description.substr(start + 9, 2);
        }

        return isNaN(episodeNumber / 1) ? '-' : episodeNumber;
    }

    return '-';
}

function searchProgramName(summary) {
    const start = summary.indexOf('(');

    if (typeof start !== 'undefined') {
        const name = summary.substr(0, start - 1);
        return name;
    }
    return summary;
}

function getSeriesID(body) { // eslint-disable-line
    const series = {};

    const $ = cheerio.load(body, {
        xmlMode: true,
    });
    let seriesid = $('Data').find('Series').find('seriesid').text();

    if (seriesid.substr(0, 6) === seriesid.substr(6, 6)) {
        seriesid = seriesid.substr(0, 6);
    } else if (seriesid.substr(0, 5) === seriesid.substr(5, 5)) {
        seriesid = seriesid.substr(0, 5);
    } else if (seriesid.length % 5 === 0) {
        seriesid = seriesid.substr(0, 5);
    } else {
        seriesid = seriesid.substr(0, 6);
    }

    series.seriesid = seriesid;

    // var program = new Program();
    //
    // newProgram.channelName = channel.channelName;
    // newProgram.data.name = series.name;
    // newProgram.data.description = series.description;
    // newProgram.data.season = series.season;
    // newProgram.data.episode = series.episode;
    // newProgram.data.start = series.start;
    // newProgram.data.end = series.end;
    // newProgram.data.seriesid = series.seriesid;
    //
    // newProgram.save(function(err) {
    //     if (err) throw err;
    // });
}


// Gets information for every channel
function processBaseInformation(body, channelName) {
    // allPrograms.length = 0;
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
        starts[i] = elem.children.length > 0 ? elem.children[0].data : '';
    });

    $('._end').each((i, elem) => {
        ends[i] = elem.children.length > 0 ? elem.children[0].data : '';
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

        const newProgram = new Program();

        newProgram.channelName = channelName;
        newProgram.data.name = temp.name;
        newProgram.data.description = temp.description;
        newProgram.data.season = temp.season;
        newProgram.data.episode = temp.episode;
        newProgram.data.start = temp.start;
        newProgram.data.end = temp.end;

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


        // let reducedPrograms = allPrograms.map((channel) => {
        //     return channel.data.map((series) => {
        //         return shouldSearchForId(series.name);
        //     });
        // });
        //
        // console.log(allPrograms.length, reducedPrograms.length);

        // promises = [];
        // allPrograms.map((channel) => {
        //     channel.data.map((series) => {
        //         let name = series.name;
        //         if (shouldSearchForId(name)) {
        //             promises.push(rp('http://thetvdb.com/api/GetSeries.php?seriesname='+name+'&language=fi'));
        //         }
        //     });
        // });
        //
        // Promise.all(promises)
        //     .then((results) => {
        //         results.map((series) => {
        //             getSeriesID(series);
        //         });
        //     }).catch(error => {
        //         console.log('error', error);
        //     });
    });
}


module.exports = {
    scrape,
};

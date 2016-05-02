'use strict';

const cheerio = require('cheerio'),
    _ = require('lodash'),
    request = require('request'),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    Program = require('../models/program.js'),
    rp = require('request-promise');

// We need finnish localization
const moment = require('moment-timezone');
moment.locale('fi');

const baseUrl = "http://www.telsu.fi/";
const channels = ["yle1","yle2","mtv3","nelonen","subtv","liv","jim","viisi","kutonen","fox","ava","hero"];
// const channels = ["yle1"];
let content = "";
let descriptions = [];
let names = [];
let seasons = [];
let episodes = [];
let starts = [];
let ends = [];

let allPrograms = [];

function searchSeasonNumber(description) {

    let start = description.indexOf("Kausi");
    let number;

    if(description.charAt(start+8) !== '.') {
        number = description.substr(start+6,1);
    } else {
        number = description.substr(start+6,2);
    }

    if(isNaN(number/1)) {
        return '-';
    } else {
        return number;
    }
}

function searchEpisodeNumber(description) {

    let start, number;

    if(description.indexOf("Jakso") !== -1) {

        start = description.indexOf("Jakso");

        if(description.charAt(start+8) !== '/') {
            number = description.substr(start+6,1);
        } else if(description.charAt(start+8 === '/')) {
            number = description.substr(start+6,2);
        }

        if(isNaN(number/1)) {
            return '-';
        } else {
            return number;
        }

    } else if(description.indexOf("jakso") !== -1) {

        start = description.indexOf("jakso");

        if(description.charAt(start+8) !== '/') {
            number = description.substr(start+6,1);
        } else if(description.charAt(start+8 === '/')) {
            number = description.substr(start+6,2);
        }

        if(isNaN(number/1)) {
            return '-';
        } else {
            return number;
        }

    } else if(description.indexOf("osa") !== -1) {

        console.log("osa found");

    } else {

        start = description.indexOf("Kausi");

        if(description.charAt(start+11) !== '/') {
            number = description.substr(start+9,1);
        } else if(description.charAt(start+11 === '/')) {
            number = description.substr(start+9,2);
        }

        if(isNaN(number/1)) {
            return '-';
        } else {
            return number;
        }
    }

    return '-';
}

function searchProgramName(summary) {

    let start = summary.indexOf("(");

    if(typeof start !== undefined) {
        var name = summary.substr(0,start-1);
        return name;
    } else {
        return summary;
    }
}

function getSeriesID(body) {

    let series = {};

    console.log(body);

    let $ = cheerio.load(body, { xmlMode: true });
    let seriesid = $('Data').find('Series').find('seriesid').text();

    if(seriesid.substr(0,6) === seriesid.substr(6,6)) {
        seriesid = seriesid.substr(0,6);
    } else if(seriesid.substr(0,5) === seriesid.substr(5,5)) {
        seriesid = seriesid.substr(0,5);
    } else if(seriesid.length % 5 === 0) {
        seriesid = seriesid.substr(0,5);
    } else {
        seriesid = seriesid.substr(0,6);
    }

    series.seriesid = seriesid;
    console.log(series.name + ": " + series.seriesid);

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
    //     if(err) throw err;
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

    let $ = cheerio.load(body);

    $('._summary').each((i,elem) => {
        let summary = elem.children[0].data;
        names[i] = searchProgramName(summary);
    });

    $('._description').each((i,elem) => {

        console.log(elem.children);
        let description = elem.children.length > 0 ? elem.children[0].data : "";

        if(description.length === 0) {
            descriptions[i] = "Ei kuvausta saatavilla.";
            seasons[i] = "-";
            episodes[i] = "-";
        } else {
            descriptions[i] = description;
            seasons[i] = searchSeasonNumber(description);
            episodes[i] = searchEpisodeNumber(description);
        }
    });

    $('._start').each((i,elem) => {
        starts[i] = elem.children.length > 0 ? elem.children[0].data : "";
    });

    $('._end').each((i,elem) => {
        ends[i] = elem.children.length > 0 ? elem.children[0].data : "";
    });

    let programs = [];

    // this combines information to JSON
    for(var i = 0; i < names.length; ++i) {

        let name = names[i];
        let description = descriptions[i];
        let season = seasons[i];
        let episode = episodes[i];
        let start = starts[i];
        let end = ends[i];

        let temp = {
            name: name,
            description: description,
            season: season,
            episode: episode,
            start: start,
            end: end
        };

        programs.push(temp);

        let newProgram = new Program();

        newProgram.channelName = channelName;
        newProgram.data.name = temp.name;
        newProgram.data.description = temp.description;
        newProgram.data.season = temp.season;
        newProgram.data.episode = temp.episode;
        newProgram.data.start = temp.start;
        newProgram.data.end = temp.end;

        newProgram.save((err) => {
            if(err) throw err;
        });

    }

    let temp = {
        channelName: channelName,
        data: programs
    };

    console.log(temp);

    allPrograms.push(temp);

    console.log(allPrograms.length + " === " + channels.length);

    if(allPrograms.length === channels.length) {
        console.log("all channels processed");
        eventEmitter.emit('base_finished');
    }
}

function shouldSearchForId(name) {
    const lookUpTable = [
        "uuti"
    ];

    let result = lookUpTable.reduce((item, acc) => {
        return name.indexOf(item) > -1 ? true : acc;
    }, false);

    console.log(result);
    return result;
}

function scrape () {

    allPrograms.length = 0;
    descriptions.length = 0;
    names.length = 0;
    seasons.length = 0;
    episodes.length = 0;
    starts.length = 0;
    ends.length = 0;

    Program.remove().exec();

    let today = moment().tz('Europe/Helsinki').format('dddd');
    console.log(today);

    let promises = [];

    channels.map((channel) => {
        promises.push(rp("http://www.telsu.fi/"+today+"/"+channel));
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
        //         if(shouldSearchForId(name)) {
        //             promises.push(rp("http://thetvdb.com/api/GetSeries.php?seriesname="+name+"&language=fi"));
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
        //         console.log("error", error);
        //     });
    });
}


module.exports = {
    scrape: scrape
};

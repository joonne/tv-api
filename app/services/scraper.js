'use strict';

var cheerio = require('cheerio'),
  _ = require('lodash'),
  request = require('request'),
  events = require('events'),
  eventEmitter = new events.EventEmitter(),
  Program = require('../models/program.js'),
  rp = require('request-promise');

// We need finnish localization
var moment = require('moment-timezone');
moment.locale('fi');

var baseUrl = "http://www.telsu.fi/";
var channels = ["yle1","yle2","mtv3","nelonen","subtv","liv","jim","viisi","kutonen","fox","ava","hero"];
// var channels = ["yle1","yle2","mtv3"];
var content = "";
var descriptions = [];
var names = [];
var seasons = [];
var episodes = [];
var starts = [];
var ends = [];

var allPrograms = [];

function searchSeasonNumber(description) {

  var start = description.indexOf("Kausi");
  var number;

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

  if(description.indexOf("Jakso") !== -1) {

    var start = description.indexOf("Jakso");
    var number;

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

    var start = description.indexOf("jakso");
    var number;

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

    var start = description.indexOf("Kausi");
    var number;

    if(description.charAt(start+11) !== '/') {
      number = description.substr(start+9,1);
      console.log("Jakso " + number);
    } else if(description.charAt(start+11 === '/')) {
      number = description.substr(start+9,2);
      console.log("Jakso " + number);
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

  var start = summary.indexOf("(");

  if(typeof(start) !== undefined) {
    var name = summary.substr(0,start-1);
    return name;
  } else {
    return summary;
  }
}

function getSeriesIDs() {

  _.map(allPrograms, (channel,index) => {
    _.map(channel.data, (series) => {

      var name = series.name;
      var url = "http://thetvdb.com/api/GetSeries.php?seriesname="+name+"&language=fi";

      request(url, (err, res, body) => {

        if(res.statusCode === 200) {

          $ = cheerio.load(body, { xmlMode: true });
          var seriesid = $('Series').find('seriesid').text();

          if(seriesid.substr(0,6) === seriesid.substr(6,6)) {
            seriesid = seriesid.substr(0,6);
          } else if(seriesid.substr(0,5) === seriesid.substr(5,5)) {
            seriesid = seriesid.substr(0,5);
          } else if(seriesid.length % 5 === 0) {
            seriesid = seriesid.substr(0,5);
          } else {
            seriesid = seriesid.substr(0,6);
          }

          console.log(channel.channelName + " " + name + ": " + seriesid);
          series.seriesid = seriesid;

          var newProgram = new Program();

          newProgram.channelName = channel.channelName;
          newProgram.data.name = series.name;
          newProgram.data.description = series.description;
          newProgram.data.season = series.season;
          newProgram.data.episode = series.episode;
          newProgram.data.start = series.start;
          newProgram.data.end = series.end;
          newProgram.data.seriesid = series.seriesid;

          newProgram.save(function(err) {
            if(err) throw err;
          });

        }
      });
    });
  });
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

  $('._summary').each(function(i,elem) {
    var programName = searchProgramName($(this).text());
    names[i] = programName;
  });

  $('._description').each(function(i,elem) {

    var description = $(this).text();

    if(description.length === 0) {
      descriptions[i] = "Ei kuvausta saatavilla.";
    } else {
      descriptions[i] = description;
      seasons[i] = searchSeasonNumber(description);
      episodes[i] = searchEpisodeNumber(description);
    }
  });

  $('._start').each(function(i,elem) {
    starts[i] = $(this).text();
  });

  $('._end').each(function(i,elem) {
    ends[i] = $(this).text();
  });

  var programs = [];

  // this combines information to JSON
  for(var i = 0; i < names.length; ++i) {

    var name = names[i];
    var description = descriptions[i];
    var season = seasons[i];
    var episode = episodes[i];
    var start = starts[i];
    var end = ends[i];

    var temp = {
      name: name,
      description: description,
      season: season,
      episode: episode,
      start: start,
      end: end
    };

    programs.push(temp);

    var newProgram = new Program();

    newProgram.channelName = channelName;
    newProgram.data.name = temp.name;
    newProgram.data.description = temp.description;
    newProgram.data.season = temp.season;
    newProgram.data.episode = temp.episode;
    newProgram.data.start = temp.start;
    newProgram.data.end = temp.end;

    newProgram.save(function(err) {
      if(err) throw err;
    });

  }

  var temp = {
    channelName: channelName,
    data: programs
  };

  allPrograms.push(temp);

  console.log(allPrograms.length + " === " + channels.length);

  if(allPrograms.length === channels.length) {
    console.log("all channels processed");
    eventEmitter.emit('base_finished');
  }
}


module.exports = {

  scrape: function () {

    allPrograms.length = 0;
    descriptions.length = 0;
    names.length = 0;
    seasons.length = 0;
    episodes.length = 0;
    starts.length = 0;
    ends.length = 0;

    Program.remove().exec();
    // There is expires field so documents older than 2 days will expire automatically

    var today = moment().tz('Europe/Helsinki').format('dddd');
    console.log(today);

    // var channels = ["yle1","yle2","mtv3","nelonen","subtv","liv","jim","viisi","kutonen","fox","ava","hero"];

    request("http://www.telsu.fi/"+today+"/yle1", (err, res, body) => {

      processBaseInformation(body, "yle1");

      request("http://www.telsu.fi/"+today+"/yle2", (err, res, body) => {

        processBaseInformation(body, "yle2");

        request("http://www.telsu.fi/"+today+"/mtv3", (err, res, body) => {

          processBaseInformation(body, "mtv3");

          request("http://www.telsu.fi/"+today+"/nelonen", (err, res, body) => {

            processBaseInformation(body, "nelonen");

            request("http://www.telsu.fi/"+today+"/subtv", (err, res, body) => {

              processBaseInformation(body, "subtv");

              request("http://www.telsu.fi/"+today+"/liv", (err, res, body) => {

                processBaseInformation(body, "liv");

                request("http://www.telsu.fi/"+today+"/jim", (err, res, body) => {

                  processBaseInformation(body, "jim");

                  request("http://www.telsu.fi/"+today+"/viisi", (err, res, body) => {

                    processBaseInformation(body, "viisi");

                    request("http://www.telsu.fi/"+today+"/kutonen", (err, res, body) => {

                      processBaseInformation(body, "kutonen");

                      request("http://www.telsu.fi/"+today+"/fox", (err, res, body) => {

                        processBaseInformation(body, "fox");

                        request("http://www.telsu.fi/"+today+"/mtv3ava", (err, res, body) => {

                          processBaseInformation(body, "ava");

                          request("http://www.telsu.fi/"+today+"/hero", (err, res, body) => {

                            processBaseInformation(body, "hero");

                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    // eventEmitter.once('base_finished', function() {
    //   getSeriesIDs();
    // });

  }
}

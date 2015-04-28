var cheerio = require('cheerio');
var http = require('http');
var _ = require('lodash');
var request = require('request');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var Program = require('../models/program.js');

// We need finnish localization
var moment = require('moment');
moment.locale('fi');

var baseUrl = "http://www.telsu.fi/";
var channels = ["yle1","yle2","mtv3","nelonen","subtv","liv","jim","viisi","kutonen","fox","ava","hero"];
// var channels = ["subtv"];
var today = moment().format('dddd');
var content = "";
var descriptions = [];
var names = [];
var seasons = [];
var episodes = [];
var starts = [];
var ends = [];
var ids = [];

var allPrograms = [];

function searchSeasonNumber(description) {

   var start = description.indexOf("Kausi");
   var number;

   if(description.charAt(start+8) !== '.') {
      number = description.substr(start+6,1);
      //console.log("Kausi " + number);
   } else {
      number = description.substr(start+6,2);
      //console.log("Kausi " + number);
   }

   if(isNaN(number/1)) {
      return '-';
   } else {
      return number;
   }
}

function searchEpisodeNumber(description) {

   var start = description.indexOf("Jakso");
   var number;

   if(description.charAt(start+8) !== '/') {
      number = description.substr(start+6,1);
      //console.log("Jakso " + number);
   } else {
      number = description.substr(start+6,2);
      //console.log("Jakso " + number);      
   }

   if(isNaN(number/1)) {
      return '-';
   } else {
      return number;
   }
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

   _.map(allPrograms, function(channel,index) {
      _.map(channel.data, function(series) {

         var name = series.name;
         var url = "http://thetvdb.com/api/GetSeries.php?seriesname="+name+"&language=fi";

         request(url, function(name) { return function(err,resp,body) {

            if(resp.statusCode === 200) {

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

               console.log(name + ": " + seriesid);
               series.seriesid = seriesid;

               var newProgram = new Program();

               // console.log(newProgram.createdAt);

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

         }}(name));
      });
   });
}


// Gets information for every channel
function getBaseInformation() {

   for(channel in channels) {

      var url = "http://www.telsu.fi/"+today+"/"+channels[channel];

      request(url, (function(channel) { return function(err,resp,body) {
         
         $ = cheerio.load(body);

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

         }

         var channelName = channels[channel];

         var temp = {
            channelName: channelName,
            data: programs
         };

         allPrograms.push(temp);

         if(allPrograms.length === channels.length) {
            eventEmitter.emit('base_finished');
         }


      }})(channel));
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
      ids.length = 0;

      Program.remove().exec();
      // There is expires field so documents older than 2 days will expire automatically

      getBaseInformation();

      eventEmitter.once('base_finished', function() {
         getSeriesIDs();
      });
   }
}
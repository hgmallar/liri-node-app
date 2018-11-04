var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');

//code required to import the keys.js file and store it in a variable.
const keys = require('./keys');

var spotify = new Spotify(keys.spotify);

if (process.argv[2] === "concert-this") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited artist
    var artist = process.argv.slice(3).join(" ");
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsInTown.id;
    request(url, function (error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover the venue name, location and date
            json = JSON.parse(body); // `json` will be an array of objects
            for (i = 0; i < json.length; i++) {
                data = json[i];
                var date = data.datetime.substr(0, data.datetime.indexOf('T'));
                date = moment(date, "YYYY-MM-DD").format('L');
                console.log(data.venue.name + " in " + data.venue.city + ", " + data.venue.country + " on " + date);
            }
        }
    });

}
else if (process.argv[2] === "spotify-this-song") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited songName
    var songName = process.argv.slice(3).join(" ");

}
else if (process.argv[2] === "movie-this") {

}
else if (process.argv[2] === "do-what-it-says") {

}
else {

}
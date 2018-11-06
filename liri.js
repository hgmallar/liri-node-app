var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');
var fs = require("fs");

//code required to import the keys.js file and store it in a variable.
const keys = require('./keys');

var spotify = new Spotify(keys.spotify);

function concertThis(artist) {
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsInTown.id;
    request(url, function (error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover the venue name, location and date
            var json = JSON.parse(body); // `json` will be an array of objects
            console.log();
            for (i = 0; i < json.length; i++) {
                data = json[i];
                var date = data.datetime.substr(0, data.datetime.indexOf('T'));
                date = moment(date, "YYYY-MM-DD").format('L');
                var outputString = data.venue.name + " in " + data.venue.city + ", " + data.venue.country + " on " + date;
                console.log(outputString);
                writeFile(outputString + "\n");
            }
        }
        else if (error) {
            console.error('Error occurred: ' + error);
        }
    });
};

function spotifyThisSong(songName) {
    if (songName === 'track:""') {
        songName = 'track:"The Sign" artist:"Ace of Base"';
    }
    spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
        if (err) {
            console.error('Error occurred: ' + err);
        }
        var sing = " sings ";
        if (data.tracks.items[0].album.artists[0].name.charAt(data.tracks.items[0].album.artists[0].name.length - 1) === "s") {
            sing = " sing ";
        }
        var outputString = data.tracks.items[0].album.artists[0].name + sing + data.tracks.items[0].name + " on the album " + data.tracks.items[0].album.name;
        console.log();
        console.log(outputString);
        writeFile(outputString + "\n");
        if (data.tracks.items[0].preview_url != null) {
            outputString = "A preview can be found at " + data.tracks.items[0].preview_url;
            console.log(outputString);
            writeFile(outputString + "\n");
        }
    });
};

function movieThis(movieName) {
    if (movieName === "") {
        movieName = "Mr. Nobody";
    }
    var request = require("request");
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            var json = JSON.parse(body); // `json` will be an array of objects
            console.log();
            var outputString = json.Title + " was released in " + json.Year + "."
            console.log(outputString);
            writeFile(outputString + "\n");
            outputString = "It's IMDB rating is " + json.Ratings[0].Value + ". It's Rotten Tomatoes rating is " + json.Ratings[1].Value + ".";
            console.log(outputString);
            writeFile(outputString + "\n");
            outputString = "It was produced in " + json.Country + " and is in " + json.Language + ".";
            console.log(outputString);
            writeFile(outputString + "\n");
            outputString = "The plot is as follows . . . " + json.Plot;
            console.log(outputString);
            writeFile(outputString + "\n");
            outputString = "The actors are " + json.Actors + ".";
            console.log(outputString);
            writeFile(outputString + "\n");
        }
        else if (error) {
            console.error('Error occurred: ' + error);
        }
    });
}

function writeFile(outputText) {
    fs.appendFile("log.txt", outputText, function (err) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }
    });
};

if (process.argv[2] === "concert-this") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited artist
    var artist = process.argv.slice(3).join(" ");
    if (artist) {
        writeFile("\n");
        writeFile(process.argv.slice(2).join(" ").trim() + "\n");
        concertThis(artist);
    }
    else {
        console.log("You must enter an artist!");
        writeFile("You must enter an artist!" + "\n");
    }
}
else if (process.argv[2] === "spotify-this-song") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited songName
    var songName = "";
    songName = 'track:"' + process.argv.slice(3).join("+") + '"';
    writeFile("\n");
    writeFile(process.argv.slice(2).join(" ") + "\n");
    spotifyThisSong(songName);
}
else if (process.argv[2] === "movie-this") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited movieName
    var movieName = "";
    movieName = process.argv.slice(3).join("+");
    writeFile("\n");
    writeFile(process.argv.slice(2).join(" ") + "\n");
    movieThis(movieName);
}
else if (process.argv[2] === "do-what-it-says") {
    writeFile("\n");
    writeFile(process.argv.slice(2).join(" ") + "\n");
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors, log the error to the console.
        if (error) {
            return console.log(error);
        }

        writeFile(data + "\n");

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        if (dataArr[0] === "concert-this") {
            concertThis(dataArr[1]);
        }
        else if (dataArr[0] === "spotify-this-song") {
            var songName = "";
            songName = 'track:' + dataArr[1];
            spotifyThisSong(songName);
        }
        else if (dataArr[0] === "movie-this") {
            movieThis(dataArr[1].replace(/ /g, '+'));
        }
        else {
            console.log(dataArr[0] + " is not a recognized command!");
            writeFile(dataArr[0] + " is not a recognized command!\n");
        }

    });
}
else {
    console.log(process.argv[2] + " is not a recognized command!");
    writeFile(process.argv[2] + " is not a recognized command!\n")
}
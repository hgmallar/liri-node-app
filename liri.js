var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');
var fs = require("fs");

//code required to import the keys.js file and store it in a variable.
const keys = require('./keys');

var spotify = new Spotify(keys.spotify);

//function to perform correct output for concert-this command
function concertThis(artist) {
    //create the url using the artist
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsInTown.id;
    request(url, function (error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover the venue name, location and date
            var json = JSON.parse(body); // `json` will be an array of objects
            console.log();
            for (i = 0; i < json.length; i++) {
                //print a line for each item in the array
                data = json[i];
                var date = data.datetime.substr(0, data.datetime.indexOf('T'));
                //convert the date to the correct format
                date = moment(date, "YYYY-MM-DD").format('L');
                var outputString = data.venue.name + " in " + data.venue.city + ", " + data.venue.country + " on " + date;
                console.log(outputString);
                writeFile(outputString + "\n");
            }
        }
        else if (error) {
            //log the error
            console.error('Error occurred: ' + error);
            writeFile('Error occurred: ' + error + "\n");
        }
    });
};

//function to perform correct output for spotify-this-song command
function spotifyThisSong(songName) {
    //if there was no track inputed, set the track name to The Sign by Ace of Base
    if (songName === 'track:""') {
        songName = 'track:"The Sign" artist:"Ace of Base"';
    }
    //spotify search using the songname
    spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
        if (err) {
            //log the error
            console.error('Error occurred: ' + err);
            writeFile('Error occurred: ' + err + "\n");
        }
        var sing = " sings ";
        //if the group is plural, correct the verb
        if (data.tracks.items[0].album.artists[0].name.charAt(data.tracks.items[0].album.artists[0].name.length - 1) === "s") {
            sing = " sing ";
        }
        //create an output string with the returned data
        var outputString = data.tracks.items[0].album.artists[0].name + sing + data.tracks.items[0].name + " on the album " + data.tracks.items[0].album.name;
        console.log();
        console.log(outputString);
        writeFile(outputString + " \n");
        //check to see if there is in fact a preview of the track before printing the message
        if (data.tracks.items[0].preview_url != null) {
            outputString = "A preview can be found at " + data.tracks.items[0].preview_url;
            console.log(outputString);
            writeFile(outputString + " \n");
        }
    });
};

//function to perform correct output for movie-this command
function movieThis(movieName) {
    //if there isn't a movie name, use Mr. Nobody
    if (movieName === "") {
        movieName = "Mr. Nobody";
    }
    var request = require("request");
    //create a queryUrl using the moviename
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    //make an OMDB API request
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //print the information returned
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
            //log the error
            console.error('Error occurred: ' + error);
            writeFile('Error occurred: ' + error + "\n");
        }
    });
}

//function to append text to the log.txt file
function writeFile(outputText) {
    //append the text passed in to the log.txt file
    fs.appendFile("log.txt", outputText, function (err) {
        // if the code experiences any errors it will log the error to the console
        if (err) {
            return console.log(err);
        }
    });
};

//if the input is concert-this
if (process.argv[2] === "concert-this") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited artist
    var artist = process.argv.slice(3).join(" ");
    //write the command to the log.txt file
    writeFile(" \n");
    if (artist) {
        //print the required info
        writeFile(process.argv.slice(2).join(" ").trim() + "\n");
        concertThis(artist);
    }
    else {
        //you must enter an artist
        writeFile(process.argv[2]);
        console.log("You must enter an artist!");
        writeFile("You must enter an artist!" + "\n");
    }
}
//if the input is spotify-this-song
else if (process.argv[2] === "spotify-this-song") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited songName
    var songName = "";
    songName = 'track:"' + process.argv.slice(3).join("+") + '"';
    //write the command to the log.txt file
    writeFile(" \n");
    writeFile(process.argv.slice(2).join(" ") + "\n");
    //print the required info
    spotifyThisSong(songName);
}
//if the input is movie-this
else if (process.argv[2] === "movie-this") {
    // Get all elements in process.argv, starting from index 3 to the end
    // Join them into a string to get the space delimited movieName
    var movieName = "";
    movieName = process.argv.slice(3).join("+");
    //write the command to the log.txt file
    writeFile(" \n");
    writeFile(process.argv.slice(2).join(" ") + "\n");
    //print the required info
    movieThis(movieName);
}
//if the input is do-what-it-says
else if (process.argv[2] === "do-what-it-says") {
    //write the command to the log.txt file
    writeFile(" \n");
    writeFile(process.argv.slice(2).join(" ") + "\n");
    fs.readFile("random.txt", "utf8", function (error, data) {

        // if the code experiences any errors, log the error
        if (error) {
            return console.log(error);
            writeFile(error + "\n");
        }

        //split the command in random.txt by lines
        var dataArr = data.split("\n")
        for (var i = 0; i < dataArr.length; i++) {
            var dataArrLine = dataArr[i].split(",")
            //if the first item is concert-this
            if (dataArrLine[0] === "concert-this") {
                //get the info from the API and print the necessary info using the second item in the array as artist
                concertThis(dataArrLine[1]);
            }
            //if the first item is spotify-this-song
            else if (dataArrLine[0] === "spotify-this-song") {
                //use the second item in the array as songName
                var songName = "";
                songName = 'track:' + dataArrLine[1];
                //get the info from the API and print the necessary info
                spotifyThisSong(songName);
            }
            //if the first item is movie-this
            else if (dataArrLine[0] === "movie-this") {
                //get the info from the API and print the necessary info using the second item in the array as the movieName
                movieThis(dataArrLine[1].replace(/ /g, '+'));
            }
            //there isn't a correct command written in random.txt
            else {
                //log the error
                console.log(dataArrLine[0] + " is not a recognized command!");
                writeFile(dataArrLine[0] + " is not a recognized command!\n");
            }
        }

    });
}
//either there wasn't a command, or there wasn't a recognized command
else {
    //log the error
    console.log(process.argv[2] + " is not a recognized command!");
    writeFile(process.argv[2] + " is not a recognized command!\n")
}
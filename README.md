# liri-node-app
## liri node app

### Preview Demo at:
[Video Demonstration Here](https://drive.google.com/file/d/18jORbpAmDrdgnWcPZ8Nb2pMgU_jcVw1n/view)

### Possible Inputs: 
* concert-this Artist's Name
* spotify-this-song Song Title 
* movie-this Movie Title
* do-what-it says

#### concert-this:
* Example: **concert-this**
    * returns that you must enter an artist
* Example: **concert-this Taylor Swift**
    * returns the venue, location, and dates of all of the artists upcoming concerts
    
#### spotify-this-song:
* Example: **spotify-this-song**
    * returns the, song name, and album of Ace of Base's The Sign, as well as a preview

* Example: **spotify-this-song Shape Of You**
    * returns the artist, song name, and album of the song entered, as well as a preview (if one exists)

#### movie-this:  
* Example: **movie-this**
    * returns the movie name, releases date, IMDB rating, Rotten Tomatoes rating, plot, the actors, production company and language for the movie Mr. Nobody.
* Example: **movie-this Gleaming the Cube**
    * returns the movie name, releases date, IMDB rating, Rotten Tomatoes rating, plot, the actors, production company and language for the given movie title.

#### do-what-it-says:
* Example: **do-what-it-says**
    * parses the information in **random.txt** (as shown) and performs the commands on each line
<br style="clear: both;" />
<img src="https://github.com/hgmallar/liri-node-app/blob/master/images/random.PNG?raw=true"
     alt="random.txt"
     style="float: left; margin-right: 10px;" />
<br style="clear: both;" /> 

### Results: 
* Requires **dot-env**, **node-spotify-api**, **request**, and **moment** packages.
* Uses **Bands In Town API** to get the data for concert-this.
* Uses **Spotify API** to get the data for spotify-this-song.  
* Uses **OMDB API** to get the data for movie-this.  
* All inputs and outputs get logged into a file name **log.txt**, for example . . .
![log.txt](https://github.com/hgmallar/liri-node-app/blob/master/images/log.PNG?raw=true "log.txt")

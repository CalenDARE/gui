const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const movieModel = require("./movie-model.js");
const axios = require("axios")

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, "files")));

app.get("/movies", function (req, res) {
  let movies = Object.values(movieModel);
  const queriedGenre = req.query.genre;
  if (queriedGenre) {
    movies = movies.filter((movie) => movie.Genres.indexOf(queriedGenre) >= 0);
  }
  res.send(movies);
});

// Configure a 'get' endpoint for a specific movie
app.get("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  if (exists) {
    res.send(movieModel[id]);
  } else {
    res.sendStatus(404);
  }
});

app.put("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  movieModel[req.params.imdbID] = req.body;

  if (!exists) {
    res.status(201);
    res.send(req.body);
  } else {
    res.sendStatus(200);
  }
});

app.get("/genres", function (req, res) {
  const genres = [
    ...new Set(Object.values(movieModel).flatMap((movie) => movie.Genres)),
  ];
  genres.sort();
  res.send(genres);
});

/* Task 1.1. Add the GET /search endpoint: Query omdbapi.com and return
   a list of the results you obtain. Only include the properties 
   mentioned in the README when sending back the results to the client */

app.get("/search", function (req, res) {
  const query = req.query.query;
  if (!query) {
    res.sendStatus(400);
    return;
  }

  http.get('http://www.omdbapi.com/?apikey=a6323e7d&s=\'' + req.query.query + '\'', (resp) => {
    let data = [];
    resp.on('data', (chunk) => {
      data = JSON.parse(chunk).Search;
      if (data != null) {
        for (movie of data) {
          delete movie.Type;
          delete movie.Poster;
          movie.Year = Number(movie.Year);
        }
      } else {
        data = "[]"
      }
    });
    resp.on('end', () => {
      console.log("Response ended")
      res.send(data);
    })
  }).on('error', err => {
    console.log('Error: ', err.message);
  });
});

/* Task 2.2 Add a POST /movies endpoint that receives an array of imdbIDs that the
   user selected to be added to the movie collection. Search them on omdbapi.com,
   convert the data to the format we use since exercise 1 and add the data to the
   movie collection. */

app.post("/movies", async (req, res) => {
  const idList = req.body;

  const movieList = await Promise.all(
    idList.map(async (imdbID) => {
        const omdbApiUrl = 'http://www.omdbapi.com/?apikey=a6323e7d&i=' + imdbID;
  
        const output = await axios.get(omdbApiUrl);
        const movieData = output.data;
        const movie = transformMovie(movieData);
  
        movieModel[imdbID] = movie;

        return movie;
    })
  );

  res.sendStatus(200);

});

function transformMovie(data) {
  return movie = {
    imdbID: data.imdbID,
    Title: data.Title,
    Released: new Date(data.Released).toISOString().split('T')[0],
    Runtime: data.Runtime === 'N/A' ? null : parseInt(data.Runtime),
    Genres: data.Genre.split(',').map((genre) => genre.trim()),
    Directors: data.Director.split(',').map((director) => director.trim()),
    Writers: data.Writer.split(',').map((writer) => writer.trim()),
    Actors: data.Actors.split(',').map((actor) => actor.trim()),
    Plot: data.Plot,
    Poster: data.Poster,
    Metascore: data.Metascore === 'N/A' ? null : parseInt(data.Metascore),
    imdbRating: parseFloat(data.imdbRating),
  };
}
/* Task 3.2. Add the DELETE /movies/:imdbID endpoint which removes the movie
   with the given imdbID from the collection. */

app.delete("/movies/:imdbID", (req, res) => {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  if (!exists) {
    res.sendStatus(404);
  } else {
    delete movieModel[id];
    res.sendStatus(200);
  }
});

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");

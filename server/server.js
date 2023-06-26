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

// app.get("/movies", function (req, res) {
//   let movies = Object.values(movieModel);
//   const queriedGenre = req.query.genre;
//   if (queriedGenre) {
//     movies = movies.filter((movie) => movie.Genres.indexOf(queriedGenre) >= 0);
//   }
//   res.send(movies);
// });

app.get('/football', function (req, res) {
  const testdata = {
    "response": [{
      "event": {
        "id": 979987,
        "date": "2023-06-26T16:00:00",
        "venue": {
          "id": 5153,
          "name": "Ullern kunstgress",
          "city": "Oslo"
        }
      },
      "league": {
        "id": 474,
        "name": "2. Division - Group 2",
        "country": "Norway",
        "logo": "https://media-2.api-sports.io/football/leagues/474.png",
        "flag": "https://media-3.api-sports.io/flags/no.svg",
        "season": 2023
      },
      "teams": {
        "home": {
          "id": 7042,
          "name": "Ullern",
          "logo": "https://media-3.api-sports.io/football/teams/7042.png"
        },
        "away": {
          "id": 12865,
          "name": "Strømsgodset II",
          "logo": "https://media-3.api-sports.io/football/teams/12865.png"
        }
      }
    }, {
      "event": {
        "id": 1011662,
        "date": "2023-06-26T16:00:00",
        "venue": {
          "id": 11538,
          "name": "SM Tauras Stadionas",
          "city": "Kaunas"
        }
      },
      "league": {
        "id": 361,
        "name": "1 Lyga",
        "country": "Lithuania",
        "logo": "https://media-3.api-sports.io/football/leagues/361.png",
        "flag": "https://media-3.api-sports.io/flags/lt.svg",
        "season": 2023
      },
      "teams": {
        "home": {
          "id": 13971,
          "name": "Kauno Žalgiris II",
          "logo": "https://media-3.api-sports.io/football/teams/13971.png"
        },
        "away": {
          "id": 3871,
          "name": "Žalgiris II",
          "logo": "https://media-1.api-sports.io/football/teams/3871.png"
        }
      }
    }]
  };

  const allFootball = [];
  for (const data of testdata.response) {
    const transformedData = transformFootballData(data);
    allFootball.push(transformedData);
  }

  console.log(allFootball);

  res.send(allFootball);
});

function transformFootballData(data) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const date = new Date(data.event.date).toLocaleString('de-DE', options);

  const venue = data.event.venue ? {
    id: data.event.venue.id,
    name: data.event.venue.name,
    city: data.event.venue.city,
  } : null;

  const league = {
    id: data.league.id,
    name: data.league.name,
    country: data.league.country || null,
    logo: data.league.logo,
    flag: data.league.flag || null,
    season: data.league.season,
  };

  const teams = {
    home: {
      id: data.teams.home.id,
      name: data.teams.home.name,
      logo: data.teams.home.logo,
    },
    away: {
      id: data.teams.away.id,
      name: data.teams.away.name,
      logo: data.teams.away.logo,
    },
  };

  return {
    eventID: data.event.id,
    date: date,
    venue: venue,
    league: league,
    teams: teams,
  };
}


app.get('/lol', function (req, res) {
  callScheduleApi('http://localhost:8080/data-service/lol/schedule?id=4197', res)
});


function callScheduleApi(url, res)
{
  http.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        let transformedData = [];

        if (jsonData.response && Array.isArray(jsonData.response)) {
          transformedData = jsonData.response.map(transformFootballData);
        }

        res.send(transformedData);
      } catch (error) {
        console.log('Error parsing JSON:', error);
        res.status(500).send('Error parsing JSON');
      }
    });
  }).on('error', (err) => {
    console.log('Error:', err.message);
    res.status(500).send('Error fetching data');
})};


// Configure a 'get' endpoint for a specific movie
// app.get("/movies/:imdbID", function (req, res) {
//   const id = req.params.imdbID;
//   const exists = id in movieModel;

//   if (exists) {
//     res.send(movieModel[id]);
//   } else {
//     res.sendStatus(404);
//   }
// });

// app.put("/movies/:imdbID", function (req, res) {
//   const id = req.params.imdbID;
//   const exists = id in movieModel;

//   movieModel[req.params.imdbID] = req.body;

//   if (!exists) {
//     res.status(201);
//     res.send(req.body);
//   } else {
//     res.sendStatus(200);
//   }
// });

// app.get("/leagues", function (req, res) {
//   http.get('http://localhost:8080/data-service/football/leagues', (resp) => {
//     let data = [];
//     resp.on('data', (chunk) => {
//       data = JSON.parse(chunk).response;
//       if (data != null) {

//       } else {
//         data = "[]"
//       }
//     });
//     resp.on('end', () => {
//       console.log("Response ended")
//       res.send(data);
//     })
//   }).on('error', err => {
//     console.log('Error: ', err.message);
//   });
// });

/* Task 1.1. Add the GET /search endpoint: Query omdbapi.com and return
   a list of the results you obtain. Only include the properties 
   mentioned in the README when sending back the results to the client */

// app.get("/search", function (req, res) {
//   const query = req.query.query;
//   if (!query) {
//     res.sendStatus(400);
//     return;
//   }

//   http.get('http://localhost:8080/data-service/football/leagues', (resp) => {
//     let data = [];
//     resp.on('data', (chunk) => {
//       data = JSON.parse(chunk).Search;
//       if (data != null) {
//         for (movie of data) {
//           delete movie.Type;
//           delete movie.Poster;
//           movie.Year = Number(movie.Year);
//         }
//       } else {
//         data = "[]"
//       }
//     });
//     resp.on('end', () => {
//       console.log("Response ended")
//       res.send(data);
//     })
//   }).on('error', err => {
//     console.log('Error: ', err.message);
//   });
// });

/* Task 2.2 Add a POST /movies endpoint that receives an array of imdbIDs that the
   user selected to be added to the movie collection. Search them on omdbapi.com,
   convert the data to the format we use since exercise 1 and add the data to the
   movie collection. */

// app.post("/movies", async (req, res) => {
//   const idList = req.body;

//   const movieList = await Promise.all(
//     idList.map(async (imdbID) => {
//         const omdbApiUrl = 'http://www.omdbapi.com/?apikey=a6323e7d&i=' + imdbID;
  
//         const output = await axios.get(omdbApiUrl);
//         const movieData = output.data;
//         const movie = transformMovie(movieData);
  
//         movieModel[imdbID] = movie;

//         return movie;
//     })
//   );

//   res.sendStatus(200);

// });



/* Task 3.2. Add the DELETE /movies/:imdbID endpoint which removes the movie
   with the given imdbID from the collection. */

// app.delete("/movies/:imdbID", (req, res) => {
//   const id = req.params.imdbID;
//   const exists = id in movieModel;

//   if (!exists) {
//     res.sendStatus(404);
//   } else {
//     delete movieModel[id];
//     res.sendStatus(200);
//   }
// });

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");

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
    const transformedData = transformAPIData(data);
    allFootball.push(transformedData);
  }

  console.log(allFootball);

  res.send(allFootball);
});

function transformAPIData(data) {
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
function transformServerToApiData(data) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const date = new Date(data.eventDate).toLocaleString('de-DE', options);
  const date1 = new Date(data.createDate).toLocaleString('de-DE', options);

  return {
    id: data.id,
    eventId: data.eventId,
    eventName: data.eventName,
    eventDate: data.eventDate,
    createDate: data.createDate,
    user: data.user || null
  };
}


function transformEvent(data) {
  return {
    eventId: data.eventID,
    eventDate: new Date(data.date).toISOString(),
    eventName: data.teams.home.name + " VS " + data.teams.away.name
  };
}


app.get('/LEC', function (req, res) {
  callScheduleApi('http://localhost:8080/data-service/lol/schedule?id=4197', res)
});

app.get('/LCS', function (req, res) {
  callScheduleApi('http://localhost:8080/data-service/lol/schedule?id=4198', res)
});

app.get('/LCK', function (req, res) {
  callScheduleApi('http://localhost:8080/data-service/lol/schedule?id=293', res)
});

app.get('/EPL', function (req, res) {
  callScheduleApi('http://localhost:8080/data-service/dota2/schedule?id=4807', res)
});

app.get('/EMEA', function (req, res) {
  callScheduleApi('http://localhost:8080/data-service/valorant/schedule?id=4947', res)
});

app.get('/PACIFIC', function (req, res) {
  callScheduleApi('http://localhost:8080/data-service/valorant/schedule?id=4531', res)
});

app.get('/getAllEvents', function (req, res) {
  callEventsApi("http://localhost:8081/storage-service/getAllEvents", res);
});

app.get('/getEventsForUser/:id', function (req, res) {
  callEventsApi("http://localhost:8081/storage-service/getAllEventsForUser/" + req.params.id, res);
});

function callEventsApi(url, res) {
  http.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        let transformedData = [];
        transformedData = jsonData.map(transformServerToApiData);
        res.send(transformedData);

      } catch (error) {
        console.log('Error parsing JSON:', error);
        res.status(500).send('Error parsing JSON');
      }
    });
  }).on('error', (err) => {
    console.log('Error:', err.message);
    res.status(500).send('Error fetching data');
  })
};

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
          transformedData = jsonData.response.map(transformAPIData);
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

app.post("/addEvent", (req, res) => {
  const postData = JSON.stringify(transformEvent(req.body));
   const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/storage-service/addEvent',
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Content-Length': Buffer.byteLength(postData)
     }
   };

   const request = http.request(options, (response) => {
     console.log(`STATUS: ${response.statusCode}`);
     console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
     response.setEncoding('utf8');
     let data = '';
     response.on('data', (chunk) => {
      data += chunk;
     });
     response.on('end', () => {
        res.send(data);
     });
   });
  
   request.on('error', (e) => {
     console.error(`problem with request: ${e.message}`);
   });
  
   // Write data to request body
   request.write(postData);
   request.end();
});

app.delete("/deleteEvent/:id", (req, res) => {
  const postData = req.params.id;
  const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/storage-service/deleteEventById/' + postData,
     method: 'DELETE'
   };

   const request = http.request(options, (response) => {
     console.log(`STATUS: ${response.statusCode}`);
     console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
     response.setEncoding('utf8');
     response.on('data', (chunk) => {
      console.log(chunk)
     });
     response.on('end', () => {
        res.sendStatus(200);
     });
   });
  
   request.on('error', (e) => {
     console.error(`problem with request: ${e.message}`);
   });
  
   // Write data to request body
   
   request.end();
});


app.listen(3000);

console.log("Server now listening on http://localhost:3000/");


const express = require("express");
const path = require("path");
const https = require("https");
const http = require("http");
const bodyParser = require("body-parser");
const axios = require("axios");
const e = require("express");

const app = express();


// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, "files")));


function transformAPIData(data) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const date = new Date(data.begin_at).toLocaleString('de-DE', options);

  const league = {
    id: data.league.id,
    name: data.league.name,
    logo: data.league.image_url
  };
  let teams = ''
  if (data.opponents && Array.isArray(data.opponents) && data.opponents.length == 2) {
    teams = {
      home: {
        id: data.opponents[0].opponent.id,
        name: data.opponents[0].opponent.name,
        logo: data.opponents[0].opponent.image_url
      },
      away: {
        id: data.opponents[1].opponent.id,
        name: data.opponents[1].opponent.name,
        logo: data.opponents[1].opponent.image_url
      }
    }
  } else if (data.opponents && Array.isArray(data.opponents) && data.opponents.length == 1) {
    teams = {
      home: {
        id: data.opponents[0].opponent.id,
        name: data.opponents[0].opponent.name,
        logo: data.opponents[0].opponent.image_url
      }
    }
  }

  return {
    eventID: data.id,
    date: date,
    league: league,
    teams: teams,
  };
}

function transformServerToApiData(data) {

  return {
    id: data.id,
    eventId: data.eventId,
    eventName: data.eventName,
    eventDate: data.eventDate,
    createDate: data.createDate,
    user: data.user || null
  };
}

function transformEvent(data, id) {
  let date  = new Date()
  date.setMonth(data.date.substring(3,5) - 1)
  date.setFullYear(data.date.substring(6,10))
  date.setDate(data.date.substring(0,2))
  date.setHours(data.date.substring(12,14))
  date.setMinutes(data.date.substring(15,17))
  const user = {
    id: id
  }
  return {
    user: user,
    id: data.id,
    eventId: data.eventID,
    eventDate: date,
    eventName: (data.teams.home ? data.teams.home.name : "TBD") + " VS " + (data.teams.away ? data.teams.away.name : "TBD")
  };
}


app.get('/ESL', function (req, res) {
  callScheduleApi('/csgo/matches/upcoming?filter[league_id]=4568', res)
});

app.get('/WINLINE', function (req, res) {
  callScheduleApi('/csgo/matches/upcoming?filter[league_id]=4776', res)
});

app.get('/GameChangers', function (req, res) {
  callScheduleApi('/valorant/matches/upcoming?filter[league_id]=4531', res)
});

app.get('/Worlds', function (req, res) {
  callScheduleApi('/lol/matches/upcoming?filter[league_id]=297', res)
});

app.get('/LFL', function (req, res) {
  callScheduleApi('/lol/matches/upcoming?filter[league_id]=4292', res)
});

//app.put('/storage-service/updateUser/{email},')

function callScheduleApi(url, res)
{
  const options = {
    protocol: 'https:',
    hostname: 'api.pandascore.co',
    path: url,
    headers: {
      Authorization: 'Bearer MQW4FqVVrwCSfRSa6zpLN1DwdMaA_n93LEFKcP1o10cgtnUAyS8'
    }
  }
  https.get(options, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        let transformedData = [];
        if (jsonData && Array.isArray(jsonData)) {
          transformedData = jsonData.map(transformAPIData);
        }
        res.send(transformedData);

      } catch (error) {
        console.log('Error parsing JSON:', error);
        res.status(500).send('Error parsing JSON');
      }
    });
  }).on('error', (err) => {
    //console.log('Error:', err.message);
    //res.status(500).send('Error fetching data');
})};

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
    //console.log('Error:', err.message);
    //res.status(500).send('Error fetching data');
  })
};

app.post("/addEvent/:id", (req, res) => {
  const postData = JSON.stringify(transformEvent(req.body, req.params.id));
  console.log(postData)
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
  
   request.write(postData);
   request.end();
});

app.get("/auth/:email/:password", (req, res) => {
  http.get("http://localhost:8081/storage-service/login/" + req.params.email + "/" + req.params.password, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        const jsonData = JSON.parse(data)
        delete jsonData.tokens
        delete jsonData.role
        delete jsonData.accountNonLocked
        delete jsonData.authorities
        delete jsonData.accountNonExpired
        delete jsonData.credentialsNonExpired
        delete jsonData.enabled
        delete jsonData.events
        res.send(jsonData);
      } catch (error) {
        //console.log('Error parsing JSON:', error);
        //res.status(500).send('Error parsing JSON');
      }
    });
  }).on('error', (err) => {
    console.log('Error:', err.message);
    res.status(500).send('Error fetching data');
  })
});


app.post("/register", (req, res) => {
  const { firstname, lastname, email, password} = req.body;
  const postData = JSON.stringify({ firstname, lastname, email, password });

  const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/storage-service/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = http.request(options, (response) => {
    console.log(`STATUS: ${response.statusCode}`);
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

  request.write(postData);
  request.end();
});

function transformUser(data) {
  return {
    firstName: data.firstname,
    lastName: data.lastname,
    email: data.email,
    password: data.password
  };
}

app.put('/updateUser/:email', (req, res) => {
  const { firstName, lastName, email, password} = req.body;
  const postData = JSON.stringify({ firstName, lastName, email, password });

  const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/storage-service/updateUser/' + req.params.email,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = http.request(options, (response) => {
    console.log(`STATUS: ${response.statusCode}`);
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
    res.status(500).send('Interner Serverfehler');
  });

  request.write(postData);
  request.end();
});


app.delete("/deleteEvent/:id/:userId", (req, res) => {
  const postData = req.params.id;
  const userId = req.params.userId
  const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/storage-service/deleteEventById/' + postData + "/" + userId,
     method: 'DELETE'
   };

   const request = http.request(options, (response) => {
     console.log(`STATUS: ${response.statusCode}`);
     response.setEncoding('utf8');
     response.on('data', (chunk) => {
     });
     response.on('end', () => {
        res.sendStatus(200);
     });
   });
  
   request.on('error', (e) => {
     console.error(`problem with request: ${e.message}`);
   });
   
   request.end();
});


app.listen(3000);

console.log("Server now listening on http://localhost:3000/");


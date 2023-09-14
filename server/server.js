const express = require("express");
const path = require("path");
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

//app.put('/storage-service/updateUser/{email},')

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

app.get("/auth/:email", (req, res) => {
  http.get("http://localhost:8081/storage-service/getUser/" + req.params.email, (resp) => {
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
        console.log('Error parsing JSON:', error);
        res.status(500).send('Error parsing JSON');
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

app.put('/updateUser', function (req, res) {
  const body = transformUser(req.body)
  const putData = JSON.stringify(body);

  const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/storage-service/updateUser/' + body.email,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(putData)
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

  request.write(putData);
  request.end();
});


app.delete("/deleteEvent/:id", (req, res) => {
  const postData = req.params.id;
  console.log('Deleting event with ID:', postData);
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



var eventDates = {};
var eventImg = {};
var startDate = new Date(); // Start date
var endDate = new Date(); // End date
endDate.setDate(endDate.getDate() + 365); // Set the end date to one year from the start date

var currentDate = new Date(startDate); // Initialize current date as start date

while (currentDate <= endDate) {
  var dateStr = formatDate(currentDate); // Format the current date as a string

  // Generate a random event description
  var eventDescription = generateRandomEvent();
  var eventImage = getRandomImageURL();

  // Add the event for the current date
  if (!eventDates[dateStr]) {
    eventDates[dateStr] = [];
  }
  var randomIndex = Math.floor(Math.random() * eventDates[dateStr].length);
  
  eventDates[dateStr].splice(randomIndex, 0, eventDescription);
  eventDates[dateStr].splice(randomIndex, 0, eventDescription);
  eventDates[dateStr].splice(randomIndex, 0, eventDescription);

  // Move to the next day
  currentDate.setDate(currentDate.getDate() + 1);
}

// Rest of the code...

function generateRandomEvent() {
  var events = [
    'Event 1, Location 1',
    'Event 2, Location 2',
    'Event 3, Location 3',
    'Event 4, Location 4',
    'Event 5, Location 7',
    'Event 2, Location 4',
    'Event 6, Location 0',
    'Event 1, Location 8',

    // Add more event descriptions here
  ];

  // Generate a random index
  var randomIndex = Math.floor(Math.random() * events.length);
  return events[randomIndex];
}

// Event click handler
function handleEventClick(event) {
  const eventDate = event.target.dataset.date;
  const eventDescriptions = eventDates[eventDate];
  const eventImages = eventImg[eventDate];
  // Clear previous event details
  eventDetailsContainer.innerHTML = '';

  // Create event details elements
  for (let i = 0; i < eventDescriptions.length; i++) {
    const eventDescription = eventDescriptions[i];
    const eventImage1 = eventImages[i];

    const eventTitle = document.createElement('h3');
    eventTitle.textContent = 'Event ' + (i + 1);

    const eventLocation = document.createElement('p');
    eventLocation.textContent = 'Location: ' + eventDescription;

    const eventImage = document.createElement('img');
    eventImage.src = eventImage1; // Function to get a random image URL

    // Append elements to event details container
    const eventContainer = document.createElement('div');
    eventContainer.classList.add('event-container');
    eventContainer.appendChild(eventTitle);
    eventContainer.appendChild(eventLocation);
    eventContainer.appendChild(eventImage);
    eventDetailsContainer.appendChild(eventContainer);
  }

  // Show event details container
  eventDetailsContainer.style.display = 'block';
}
document.getElementById('calendar').addEventListener('click', function(event) {
  // Check if the clicked element has the 'event' class
  if (event.target.classList.contains('event')) {
    handleEventClick(event);
  }
});


function getRandomImageURL() {
  const images = [
    './match1.png',
    './match2.png',
    './match1.png'
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

var flatpickr = $('#calendar .placeholder').flatpickr({
  inline: true,
  minDate: 'today',
  maxDate: '2024-01-01', // Replace with your desired maximum date
  showMonths: 1,
  enable: Object.keys(eventDates),
  disableMobile: true,
  onDayCreate: function (dObj, dStr, fp, dayElem) {
    if (eventDates[dStr]) {
      dayElem.innerHTML += '<span class="event-mark"></span>';
    }
  },
  onChange: function (selectedDates, dateStr, instance) {
    var contents = '';
    if (eventDates[dateStr]) {
      for (var i = 0; i < eventDates[dateStr].length; i++) {
        contents += '<div class="event"><div class="date">' + dateStr + '</div><div class="location">' + eventDates[dateStr][i] + '</div></div>';
      }
    }
    $('#calendar .calendar-events').html(contents);
  },
  locale: {
    weekdays: {
      shorthand: ["S", "M", "T", "W", "T", "F", "S"],
      longhand: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]
    }
  }
});

// Event handler for displaying event details when clicked
$('#calendar .calendar-events').on('click', '.event', function () {
  var eventText = $(this).find('.location').text();
  var eventImage = getRandomImageURL();

  // Clear previous event details
  $('#event-details').empty();

  // Create a container div for the event details
  var eventDetailsContainer = $('<div>').addClass('event-details-container');

  // Create and append the event text element
  var eventTextElement = $('<div>')
    .addClass('event-text')
    .text(eventText);

  // Create and append the event image element with max width and height
  var eventImageElement = $('<img>')
    .addClass('event-image')
    .attr('src', eventImage)
    .css({
      'max-width': '500px', // Set the desired maximum width
      'max-height': '800px', // Set the desired maximum height
      'margin-top': '500px',
    });

  //eventDetailsContainer.append(eventTextElement);
  eventDetailsContainer.append(eventImageElement);

  // Append the event details container to the event-details element
  $('#event-details').append(eventDetailsContainer);
});



eventCalendarResize($(window));
$(window).on('resize', function() { 
  eventCalendarResize($(this))
})

function eventCalendarResize($el) {
  var width = $el.width()
  if (flatpickr.selectedDates.length) {
    flatpickr.clear()
  }
  if (width >= 992 && flatpickr.config.showMonths !== 3) {
    flatpickr.set('showMonths', 3)
    flatpickr.set('maxDate', '2024-01-01') // Replace with your desired maximum date
  }
  if (width < 992 && width >= 768 && flatpickr.config.showMonths !== 2) {
    flatpickr.set('showMonths', 2)
    flatpickr.set('maxDate', '2024-01-01') // Replace with your desired maximum date
  }
  if (width < 768 && flatpickr.config.showMonths !== 1) {
    flatpickr.set('showMonths', 1)
    flatpickr.set('maxDate', '2024-01-01') // Replace with your desired maximum date
    $('.flatpickr-calendar').css('width', '')
  }
}

function formatDate(date) {
  let d = date.getDate();
  let m = date.getMonth() + 1; //Month from 0 to 11
  let y = date.getFullYear();
  return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

const sampleData = {
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
};



window.onload = function() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);

      for (const football of data) {
        console.log(football);
     
     
      }
    } else {
      console.log('Request failed. Status:', xhr.status);
    }
  };

  xhr.open('GET', '/lol');
  xhr.send();
};






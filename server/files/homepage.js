let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const eventList = document.getElementById('eventList');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      daySquare.id = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => displayEventsForDay(dayString));
    } else {
      daySquare.classList.add('padding');
    }


    calendar.appendChild(daySquare);    
  }

  getEventsForUser()
}
function getEventsForUser() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
      for (match of data) {
        let month = new Date().getMonth() + 1;
        if (nav !== 0) {
          month = month + nav;
        }
        const eventDate = new Date(match.eventDate);
        const eventMonth = eventDate.getMonth() + 1;
          //console.log
        if (eventMonth === month) {
          const dayOfMonth = eventDate.getDate();
          const matchDay = document.getElementById(dayOfMonth);
          if (matchDay) {
            matchDay.id = 'matchDay';
            matchDay.textContent += "  " + match.eventName;
          }
        }
      }
    } else {
      console.log('Request failed. Status:', xhr.status);
    }
  };

  xhr.open('GET', '/getEventsForUser/' + sessionStorage.getItem("user"));
  xhr.send();
}



function displayEventsForDay(dayString) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
        // Handle the received data as per your requirements
      } else {
        console.log('Request failed. Status:', xhr.status);
      }
    };
  
    xhr.open('GET', '/getEventsForUser/' + sessionStorage.getItem("user"));
    xhr.send();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}



function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

}

window.onload = function() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
      // Handle the received data as per your requirements
    } else {
      console.log('Request failed. Status:', xhr.status);
    }
  };

  xhr.open('GET', '/getAllEvents');
  xhr.send();
};

document.addEventListener('DOMContentLoaded', function() {
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
      logoutButton.addEventListener('click', function(event) {
          event.preventDefault();
          sessionStorage.removeItem('user');
          window.location.href = "index.html";
      });
  }
});

initButtons();
load();



function addLeagues(sport) {

    if (sport == "dota") {
        appendHeader("EPL");
    } else if (sport == "valorant") {
        appendHeader("EMEA", "PACIFIC");
    } else if (sport == "lol") {
        appendHeader("LEC", "LCS", "LCK");
    }
}

function appendHeader(buttonOne, buttonTwo, buttoneThree) {
    const header = document.querySelector("header");

    if (document.contains(document.getElementById("popUp"))) {
        document.getElementById("popUp").remove();
    }   else {
        const h3 = document.createElement("div")
        h3.classList.add("header-2")
        h3.id = "popUp"
        
        if (buttonOne) {
            h3.appendChild(appendButton(buttonOne))
        }
        if (buttonTwo) {
            h3.appendChild(appendButton(buttonTwo))
        }
        if (buttoneThree) {
            h3.appendChild(appendButton(buttoneThree))
        }

        header.appendChild(h3)
    }
}

function appendButton(text) {
    const buttonDiv = document.createElement("div")
    const buttonA = document.createElement("a")
    buttonA.classList.add("header-menu-tab")
    buttonA.href = "#"
    buttonA.textContent = text
    buttonA.addEventListener("click", function(){getData(text)})
    buttonDiv.appendChild(buttonA)
    return buttonDiv
}

function getData(source) {
    if (document.contains(document.getElementById("matches"))) {
        document.getElementById("matches").remove();
    }
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);
            appendMatches(data);
            const xhr2 = new XMLHttpRequest();
            xhr2.onload = function() {
                if (xhr2.status == 200) {
                    const data = JSON.parse(xhr2.responseText);
                    for (match of data) {
                          console.log("asdf2:" + JSON.stringify(match.id))
                        if (document.contains(document.getElementById(match.eventId))) {
                            const favButton = document.getElementById(match.eventId);
                            favButton.style.color = "green";
                        }
                    }
                } else {
                    console.log('Request failed. Status:', xhr2.status);
                }
            };
            
            xhr2.open('GET', "/getEventsForUser/" + sessionStorage.getItem("user"));
            xhr2.send(); 
        } else {
            console.log('Request failed. Status:', xhr.status);
        }
    };
    
    xhr.open('GET', source);
    xhr.send(); 
}

function appendMatches(data) {
    const bodyElement = document.querySelector("body");
    const matches = document.createElement("table");
    matches.id = "matches";
    matches.classList.add("centered-container");
  
    for (const match of data) {
        console.log("TEST: " + JSON.stringify(data))
        console.log("wie tf: " + match.id)
        console.log("alles1: " + match.eventID)
  
        const tableRow = document.createElement("tr");
        const addToFavoritesButton = document.createElement("button");

        const homeLogoCol = document.createElement("td");
        const awayLogoCol = document.createElement("td");
        const homeTeamCol = document.createElement("td");
        const awayTeamCol = document.createElement("td");
        const vsListCol = document.createElement("td");
        const dateListCol = document.createElement("td");

        dateListCol.textContent = match.date;
        dateListCol.style.paddingLeft = '400px';
        dateListCol.style.paddingRight = '100px';
        tableRow.appendChild(dateListCol);

        const homeLogo = document.createElement("img");
        homeLogo.src = match.teams.home.logo;
        homeLogo.width = 70;
        homeLogo.height = 70;
        homeLogoCol.appendChild(homeLogo);
        tableRow.appendChild(homeLogoCol);

        homeTeamCol.textContent = match.teams.home.name;
    
        tableRow.appendChild(homeTeamCol);

        vsListCol.textContent = "VS";
        tableRow.appendChild(vsListCol);

        awayTeamCol.textContent = match.teams.away.name;
        awayTeamCol.style.textAlign = "right";
        tableRow.appendChild(awayTeamCol);

        const awayLogo = document.createElement("img");
        awayLogo.src = match.teams.away.logo;
        awayLogo.width = 70;
        awayLogo.height = 70;
        awayLogoCol.appendChild(awayLogo);
        awayLogoCol.style.paddingRight = '250px';
        tableRow.appendChild(awayLogoCol);

        addToFavoritesButton.textContent = "❤";
        addToFavoritesButton.style.fontSize = "40px";
        addToFavoritesButton.style.padding = '5px';
        addToFavoritesButton.style.height = '60px';
        addToFavoritesButton.style.width = '60px';
        addToFavoritesButton.style.marginTop = '22px'
        addToFavoritesButton.setAttribute("data-match-id", match.eventID);
        addToFavoritesButton.id = match.eventID //hier anstatt eventID  muss die normale ID stehen 16xx antatt 836xxx
        //das /deleteEvent/ nimmt als id die 16xx, diese 16xx kommt aber nur wenn man nur zb localhost:8081/storage-service/getAllEventsForUser/1753 
        //aufruft ka woher die id kommt, die gibt es aber nirgendwo lol
       
        console.log("ID von MAtch:" + addToFavoritesButton.id)
        console.log("stoarage: " + sessionStorage.getItem("user"));

        addToFavoritesButton.addEventListener("click", function(event) {
            addEvent(match, event);
        });
    
        tableRow.appendChild(addToFavoritesButton);
        matches.appendChild(tableRow);
    }
  
    bodyElement.appendChild(matches);
}

function addEvent(source, event) {
    const favoriteButton = event.target
    if (favoriteButton.style.color === "green") {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200 || xhr.status == 201) {
                favoriteButton.style.color = "black"
            } else {
                console.log('Request failed. Status:', xhr.status);
            }
        };
        console.log("storage:1 " + sessionStorage.getItem('user'));
        xhr.open('DELETE', "/deleteEvent/" + favoriteButton.id);
        //normale id anstatt eventid
        xhr.send();
        console.log("storage:2 " + sessionStorage.getItem('user'));
      
    } else {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200 || xhr.status == 201) {
                const data = JSON.parse(xhr.responseText);
                console.log(data)
                favoriteButton.style.color = "green"
            } else {
                console.log('Request failed. Status:', xhr.status);
            }
        };
        
        xhr.open('POST', "/addEvent/" + sessionStorage.getItem("user"));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(source));
    }
}
function isUserLoggedIn() {
    const user = sessionStorage.getItem("user");
    return user !== null && user !== undefined;
  }


document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
  
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            sessionStorage.removeItem('user');
            window.location.href = "index.html";
        });
    }
  
    if (!isUserLoggedIn() && !window.location.pathname.endsWith("index.html")) {
        window.location.href = "index.html";
        alert("Bitte zuerst einloggen");
    }
  });
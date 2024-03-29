function addLeagues(sport) {
    if (sport == "lol") {
        appendHeader("Worlds", "LFL")
    } else if (sport == "valorant") {
        appendHeader("GameChangers")
    } else if (sport == "cs") {
        appendHeader("ESL", "WINLINE")
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

        if (match.teams.home) {
            const homeLogo = document.createElement("img");
            if (match.teams.home.logo) {
                homeLogo.src = match.teams.home.logo;
            } else {
                homeLogo.src = 'images/missing.png'
            }
            homeLogo.width = 70;
            homeLogo.height = 70;
            homeLogoCol.appendChild(homeLogo);
            tableRow.appendChild(homeLogoCol);
    
            homeTeamCol.textContent = match.teams.home.name;
            tableRow.appendChild(homeTeamCol);
        } else {
            const tbdLogo = document.createElement("img");
            tbdLogo.src = 'images/TBD-W.svg.png'
            tbdLogo.width = 70;
            tbdLogo.height = 70;
            homeLogoCol.appendChild(tbdLogo);
            tableRow.appendChild(homeLogoCol);
    
            homeTeamCol.textContent = 'TBD';
            tableRow.appendChild(homeTeamCol);
        }

        vsListCol.textContent = "VS";
        tableRow.appendChild(vsListCol);

        if (match.teams.away) {
            awayTeamCol.textContent = match.teams.away.name;
            awayTeamCol.style.textAlign = "right";
            tableRow.appendChild(awayTeamCol);
    
            const awayLogo = document.createElement("img");
            if (match.teams.away.logo) {
                awayLogo.src = match.teams.away.logo;
            } else {
                awayLogo.src = 'images/missing.png'
            }
            awayLogo.width = 70;
            awayLogo.height = 70;
            awayLogoCol.appendChild(awayLogo);
            awayLogoCol.style.paddingRight = '250px';
            tableRow.appendChild(awayLogoCol);
        } else {
            awayTeamCol.textContent = 'TBD';
            awayTeamCol.style.textAlign = "right";
            tableRow.appendChild(awayTeamCol);
    
            const tbdLogo = document.createElement("img");
            tbdLogo.src = 'images/TBD-W.svg.png'
            tbdLogo.width = 70;
            tbdLogo.height = 70;
            awayLogoCol.appendChild(tbdLogo);
            awayLogoCol.style.paddingRight = '250px';
            tableRow.appendChild(awayLogoCol);
        }

        addToFavoritesButton.textContent = "❤";
        addToFavoritesButton.style.fontSize = "40px";
        addToFavoritesButton.style.padding = '5px';
        addToFavoritesButton.style.height = '60px';
        addToFavoritesButton.style.width = '60px';
        addToFavoritesButton.style.marginTop = '22px'
        addToFavoritesButton.setAttribute("data-match-id", match.eventID);
        addToFavoritesButton.id = match.eventID 

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
        xhr.open('DELETE', "/deleteEvent/" + favoriteButton.id + '/' + sessionStorage.getItem('user'));
        //normale id anstatt eventid
        xhr.send();
      
    } else {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200 || xhr.status == 201) {
                const data = JSON.parse(xhr.responseText);
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
            sessionStorage.removeItem('userFull');
            sessionStorage.removeItem('user');
            window.location.href = "index.html";
        });
    }
  
    if (!isUserLoggedIn() && !window.location.pathname.endsWith("index.html")) {
        window.location.href = "index.html";
        alert("Bitte zuerst einloggen");
    }
  });
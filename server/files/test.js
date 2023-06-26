function addLeagues(sport) {
    if (sport == "football") {
        appendHeader("Premier League", "Bundesliga", "La Liga")
    } else if (sport == "basketball") {
        appendHeader("NBA", "EuroLeague")
    } else if (sport == "lol") {
        appendHeader("LEC", "LCS", "LCK")
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
            appendMatches(data)
        } else {
        console.log('Request failed. Status:', xhr.status);
        }
    };
    
    xhr.open('GET', source);
    xhr.send(); 
}

function appendMatches(data) {
    const bodyElement = document.querySelector("body")
    const matches = document.createElement("table")
    matches.id = "matches"
    matches.classList.add("centered-container")
  
    for (const match of data) {
        const tableRow = document.createElement("tr")
        const addToFavoritesButton = document.createElement("button")

        const homeLogoCol = document.createElement("td")
        const awayLogoCol = document.createElement("td")
        const homeTeamCol = document.createElement("td")
        const awayTeamCol = document.createElement("td")
        const vsListCol = document.createElement("td")
        const dateListCol = document.createElement("td")

        dateListCol.textContent = match.date
        dateListCol.style.paddingLeft = '400px'
        dateListCol.style.paddingRight = '100px'
        tableRow.appendChild(dateListCol)

        const homeLogo = document.createElement("img")
        homeLogo.src = match.teams.home.logo
        homeLogo.width = 70
        homeLogo.height = 70
        homeLogoCol.appendChild(homeLogo)
        tableRow.appendChild(homeLogoCol)

        homeTeamCol.textContent = match.teams.home.name
        tableRow.appendChild(homeTeamCol)

        vsListCol.textContent = "VS"
        tableRow.appendChild(vsListCol)

        awayTeamCol.textContent = match.teams.away.name
        awayTeamCol.style.textAlign = "right"
        tableRow.appendChild(awayTeamCol)

        const awayLogo = document.createElement("img")
        awayLogo.src = match.teams.away.logo
        awayLogo.width = 70
        awayLogo.height = 70
        awayLogoCol.appendChild(awayLogo)
        tableRow.appendChild(awayLogoCol)


        addToFavoritesButton.textContent = "❤"
        tableRow.appendChild(addToFavoritesButton)
        matches.appendChild(tableRow)
    }
  
    bodyElement.appendChild(matches)
}
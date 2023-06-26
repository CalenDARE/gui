function addLeagues(sport) {
    if (sport == "football") {
        appendHeader("Premier League", "Bundesliga", "La Liga")
    } else if (sport == "basketball") {
        appendHeader("NBA", "EuroLeague")
    } else if (sport == "lol") {
        appendHeader("lec", "lcs", "lck")
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
    const matches = document.createElement("div")
    matches.id = "matches"
    for (const match of data) {
        const matchDiv = document.createElement("div")
        const matchA = document.createElement("a")
        matchA.textContent = match.eventID
        matchDiv.appendChild(matchA)
        matches.appendChild(matchDiv)
    }
    bodyElement.appendChild(matches)
}
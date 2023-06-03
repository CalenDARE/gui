function search() {
  /* Task 1.2: Initialize the searchForm correctly */
  const searchForm = document.querySelector("#search"); 
  let formData = new FormData(searchForm);

  if (searchForm.reportValidity()) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const sectionElement = document.querySelector("section:nth-of-type(2)");

      while (sectionElement.childElementCount > 0) {
        sectionElement.firstChild.remove();
      }

      if (xhr.status === 200) {
        const results = JSON.parse(xhr.responseText);

        /* Task 1.3 Insert the results as specified. Do NOT
           forget to also cover the case in which no results
           are available. 
          */
        if (xhr.responseText.length <= 2) {
          const noResult = document.createElement("p");
          noResult.textContent = "No results for your query '" + formData.get("query") + "' found.";
          sectionElement.appendChild(noResult)
        } else {
          const outputForm = document.createElement("form");
          outputForm.id = "output";
          for (const movie of results) {
            const article = document.createElement("article");
            const input = document.createElement("input");
            const label = document.createElement("label");
            input.type = "checkbox";
            input.value = movie.imdbID;
            input.id = movie.imdbID;
            label.htmlFor = movie.imdbID;
            label.textContent = movie.Title + " (" + movie.Year + ")";
            article.appendChild(input);
            article.appendChild(label);
            outputForm.appendChild(article);
          }
          const addButton = document.createElement("button");
          addButton.id = "addButton";
          addButton.textContent = "Add selected to collection";
          addButton.addEventListener("click", () => addMovies());
          outputForm.appendChild(addButton);
          sectionElement.appendChild(outputForm);
        }
      }
    };

    /* Task 1.2: Finish the xhr configuration and send the request */
    xhr.open("GET", "/search?query=" + formData.get("query"), true);
    xhr.send();
  }
}

/* Task 2.1. Add a function that you use as an event handler for when
   the button you added above in 1.3. is clicked. In it, call the
   POST /addMovies endpoint and pass the array of imdbID to be added
   as payload. */

function addMovies() {
  const outputForm = document.querySelector("#output"); 

  if (outputForm.reportValidity()) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/movies");
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    var postList = Array.from(checkboxes).map((checkbox) => checkbox.value)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Success: Adding Movies");
      } else {
        console.error("ERROR: Adding Movies");
      }
    };
    xhr.send(JSON.stringify(postList));
  }
}

window.onload = function () {
  document.getElementById("search").addEventListener("click", () => search());
};

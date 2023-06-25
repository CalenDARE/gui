
window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const listElement = document.querySelector("#leagues");

    if (xhr.status === 200) {
      const genres = JSON.parse(xhr.responseText);
      listElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);


    } else {
      listElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };
  xhr.open("GET", "/leagues");
  xhr.send();
};
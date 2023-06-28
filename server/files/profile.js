function Update() {
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password
  };

  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      window.location.href = "homepage.html";
    } else {
      console.log('Request failed. Status:', xhr.status);
    }
  };

  xhr.open('PUT', '/updateUser');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}

window.onload = function() {

  const data = JSON.parse(sessionStorage.getItem("userFull"))
  const firstname = document.getElementById("firstname")
  const lastname = document.getElementById("lastname")
  const email = document.getElementById("email")
  
  firstname.value = data.firstName
  lastname.value = data.lastName
  email.value = data.email

};
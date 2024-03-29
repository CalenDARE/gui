function Register() {
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
      window.location.href = "index.html";
    } else {
      console.log('Request failed. Status:', xhr.status);
    }
  };

  xhr.open('POST', '/register');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}
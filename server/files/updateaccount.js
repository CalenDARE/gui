function UpdateEmail() {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const oldemail = document.getElementById("email1").value;
    const email = document.getElementById("email2").value;
    const password = document.getElementById("password").value;

    const user = {
        firstName: firstname,
        lastName: lastname,
        password: password,
        email: email
    };

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            window.location.href = "index.html";
        } else {
            console.log('Request failed. Status:', xhr.status);
        }
    };

    xhr.open('PUT', '/updateUser/' + oldemail); 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(user));
}

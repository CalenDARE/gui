let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

let getButtons = (e) => e.preventDefault()

let changeForm = (e) => {

    switchCtn.classList.add("is-gx");
    setTimeout(function(){
        switchCtn.classList.remove("is-gx");
    }, 1500)

    switchCtn.classList.toggle("is-txr");
    switchCircle[0].classList.toggle("is-txr");
    switchCircle[1].classList.toggle("is-txr");

    switchC1.classList.toggle("is-hidden");
    switchC2.classList.toggle("is-hidden");
    aContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z200");
}

let mainF = (e) => {
    for (var i = 0; i < allButtons.length; i++)
        allButtons[i].addEventListener("click", getButtons );
    for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm)
}

//bmw m4 coupé

function Auth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const data = {
      email: email,
      password: password
    };
  
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        sessionStorage.setItem("user", response.id)
        sessionStorage.setItem("userFull", JSON.stringify(response))
        window.location.href = "homepage.html";
      } else {
        console.log('Request failed. Status:', xhr.status);
      }
    };
  
    xhr.open('GET', '/auth/' + email);
    xhr.send();
  }
  

window.addEventListener("load", mainF);
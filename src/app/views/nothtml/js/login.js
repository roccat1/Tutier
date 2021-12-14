console.log("js.js opened");

const regShowPasswButton = document.getElementById("register__show-passw-button");
const logShowPasswButton = document.getElementById("login__show-passw-button");

const regPassw = document.getElementById("register-passw");
const logPassw = document.getElementById("login-passw");

function regPressed(regShowPasswButton){
    if(regShowPasswButton.checked == true){
        regPassw.setAttribute("type","text");
    }
    else if (regShowPasswButton.checked == false){
        regPassw.setAttribute("type","password");
    }
}

function logPressed(logShowPasswButton){
    if(logShowPasswButton.checked == true){
        logPassw.setAttribute("type","text");
    }
    else if (logShowPasswButton.checked == false){
        logPassw.setAttribute("type","password");
    }
}
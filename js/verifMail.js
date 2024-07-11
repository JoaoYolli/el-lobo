let tries = 0

function verifMailEventListener() {

    var urlParams = new URLSearchParams(window.location.search);
    var mail = urlParams.get('mail');
    let url = properties["protocol"] + properties["url"] + properties["port"] + '/verify-code'
    console.log("BOTON", mail)

    document.getElementById("text").innerHTML = `Se ha enviado un código de confirmación a <strong id="user-email">${mail}</strong>.`;

    document.getElementById("verification-form").addEventListener("submit", async (event) => {
        event.preventDefault()

        const mailJSON = { "mail": mail, "code": document.getElementById("verification-code").value };
        console.log(mailJSON)

        const response = await fetch(url, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
                "Content-Type": "application/json" // TODO Why is it working?
            },
            body: JSON.stringify(mailJSON),
        });

        if (response.status == 200) {
            createUserRequest(mail, document.getElementById("user-name").value)
        } else {
            tries++
            if (tries < 3) {
                alert("Codigo incorrecto")
            } else {
                alert("Intentos maximos alcanzados volviendo al login")
                deleteVerfication(mail)
                window.location.href = "../pages/login.html";
            }

        }

    })

}

async function deleteVerfication(mail) {
    let url = properties["protocol"] + properties["url"] + properties["port"] + '/delete-verification'

    const response = await fetch(url, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
            "Content-Type": "application/json" // TODO Why is it working?
        },
        body: JSON.stringify({ "mail": mail }),
    });

    if (response.status == 200) {
        console.log("Verificacion borrada")
    } else {
        console.log("Error al borrar la verificacion")
    }
}

async function createUserRequest(mail, akka) {

    console.log("CREATE USER")
    let url = properties["protocol"] + properties["url"] + properties["port"] + '/create-user'

    const mailJSON = { "mail": mail, "akka": akka };
    console.log(mailJSON)

    const response = await fetch(url, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mailJSON),
    });
    if (response.status == 200) {
        // console.log(JSON.parse(await response.text())["token"])
        sessionStorage.setItem("currentMail", mail);
        sessionStorage.setItem("currentUser", akka);
        localStorage.setItem("token", JSON.parse(await response.text())["token"]);
        window.location.href = "../pages/playing.html"
    } else {
        alert("Error al loggear, intentelo mas tarde")
    }

}

async function checkToken(token) {

    let url = properties["protocol"] + properties["url"] + properties["port"] + '/check-token'

    return new Promise(async (resolve) => {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
                "Content-Type": "application/json" // TODO Why is it working?
            },
            body: JSON.stringify({ "token": token }),
        });

        if (response.status == 200) {
            let respuesta = response.text()
            console.log(respuesta)
            sessionStorage.setItem("currentUser", JSON.parse(await respuesta)["userName"])
            sessionStorage.setItem("currentMail", JSON.parse(await respuesta)["userMail"])
            resolve(true)

        } else {
            resolve(false)
        }
    })

}

async function init() {
    var urlParams = new URLSearchParams(window.location.search);
    var mail = urlParams.get('mail');

    if (mail !== null && mail !== "") {
        verifMailEventListener()
    } else {
        window.location.href = "../pages/login.html";
    }
}

init()
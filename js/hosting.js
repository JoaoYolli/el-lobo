let socket
let codigo
let trys = 0

window.addEventListener('load', async () => {
    codigo = await createGameReq(codigo)
    console.log(codigo)

});

async function createGameReq(cod) {

    return new Promise(async (resolve) => {
        try {
            if (trys === 5) {
                alert("El servidor no responde, vuelva a intentarlo más tarde.")
                return
            }
            trys++
            console.log(trys)
            console.log("BOTON")
            let url = properties["protocol"]+properties["url"]+properties["port"]+'/host-game'

            const json = {};

            const response = await fetch(url, {
                method: "POST",
                mode: "cors", // no-cors, *cors, same-origin
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(json),
            });
            if (response.status == 200) {
                let respuesta = JSON.parse(await response.text())
                document.getElementById("gameCode").innerHTML = respuesta["content"]
                await initializeWebSocket(respuesta["content"])
                let spinner = document.getElementById("loadSpinner")
                spinner.classList.add('d-none');
                resolve(respuesta["content"])
            } else {
                resolve(cod = await createGameReq())
            }
        } catch (error) {

            return cod = await createGameReq(cod)

        }
    })


}

async function startGame() {

    console.log(socket)

    let toSend = `start-game/${codigo}`

    const selectedRoles = [];
    const form = document.getElementById('rolesForm');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');

    checkboxes.forEach((checkbox) => {
        toSend = toSend + "/" + checkbox.value
    });


    socket.send(toSend)

}

async function initializeWebSocket(codigo) {
    return new Promise((resolve) => {
        socket = new WebSocket('ws://'+properties["url"]+properties["port"]);

        // Evento de conexión exitosa
        socket.addEventListener('open', function (event) {
            console.log('Conectado al servidor WebSocket');
            socket.send(`register/${codigo}/host`)
        });

        // Evento de mensaje recibido
        socket.addEventListener('message', function (event) {
            console.log('Mensaje del servidor:', event.data);
            identifyMessageFromServer(event.data)
            //   addMessageToChat(event.data);
        });

        // Evento de cierre de conexión
        socket.addEventListener('close', function (event) {
            console.log('Desconectado del servidor WebSocket');
        });
        resolve()
    })


}

function identifyMessageFromServer(message) {
    let parts = message.split("/")
    let lista = document.getElementById("playersList")
    lista.innerHTML = "<h3>Players List</h3>"
    if (parts[0] === "PlayerUpdated") {
        for (let i = 1; i <= parts.length; i++) {
            if (parts[i]) {
                lista.innerHTML = lista.innerHTML + "<p>" + parts[i] + "</p>"
            }
        }
    }
    if (parts[0] === "roles-shown") {

        setTimeout(() => {
            console.log("Start now the game")
        }, 5000)

    }
    if (parts[0] === "need-more-players") {

        alert("Minimum players: 4")

    }

}

function copy() {
        // Obtener el contenido de la etiqueta <label>
        var texto = document.getElementById("gameCode").innerText;
  
        // Crear un elemento de texto oculto
        var area = document.createElement("textarea");
        area.value = texto;
  
        // Evitar que el área de texto sea visible en la pantalla
        area.style.position = "fixed";
        area.style.left = "-9999px";
  
        // Agregar el área de texto al documento
        document.body.appendChild(area);
  
        // Seleccionar el contenido del área de texto
        area.select();
        area.setSelectionRange(0, 99999); // Para dispositivos móviles
  
        // Copiar el texto al portapapeles
        document.execCommand("copy");
  
        // Eliminar el área de texto del documento
        document.body.removeChild(area);

    let elemento = document.getElementsByClassName("toast")[0]
    elemento.className = elemento.className.replace("invisible", "visible")

}

function closeToast() {
    let elemento = document.getElementsByClassName("toast")[0]
    elemento.className = elemento.className.replace("visible", "invisible")
}


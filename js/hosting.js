let socket
let codigo
let trys = 0
let isPaused = false;
let roles = []
let speed = 1.25

document.getElementById("countdown").style.display = "none"

window.addEventListener('load', async () => {
    codigo = await createGameReq(codigo)
    console.log(codigo)

    document.getElementById("btnSi").onclick = function () {
        cerrarModal();
        startGame()
        // Aquí puedes hacer algo cuando el usuario hace clic en "Sí"
    }

    document.getElementById("btnNo").onclick = function () {
        cerrarModal();
        // Aquí puedes hacer algo cuando el usuario hace clic en "No"
    }
});

function mostrarModal(txt) {
    let modal = document.getElementById("miVentanaModal");
    setModalQuestion(txt)
    modal.style.display = "block";
}

function cerrarModal() {
    let modal = document.getElementById("miVentanaModal");
    modal.style.display = "none";
}

function setModalQuestion(txt){
    let label = document.getElementById("qModal");
    label.innerHTML = txt;
}

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
            let url = properties["protocol"] + properties["url"] + properties["port"] + '/host-game'

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

    let toSend = `start-game/${codigo}`
    
    roles = []
    toSend += getRoles()

    socket.send(toSend)

    console.log(roles)

    gameSequence()

}

function getRoles(){
    let textRoles = ""
    const form = document.getElementById('rolesForm');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox) => {
        if (checkbox.value == "aldeano") {
            let aldeanosInput = document.getElementById('aldeanoCount').value;
            let aldeanos = parseInt(aldeanosInput, 10)
            for (let i = 0; i < aldeanos; i++) {
                textRoles = textRoles + "/" + checkbox.value
                roles.push(checkbox.value)
            }

        } else {
            textRoles = textRoles + "/" + checkbox.value
            roles.push(checkbox.value)
        }
    });
    return textRoles
}

async function checkPlayers(){
    let toSend = `check-players/${codigo}`
    socket.send(toSend)
}

async function initializeWebSocket(codigo) {
    return new Promise((resolve) => {
        socket = new WebSocket('ws://' + properties["url"] + properties["port"]);

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
    if (parts[0] === "players-number") {
        let numJugadores = parseInt(parts[1])
        roles = []
        getRoles()
        if(numJugadores < roles.length){
            mostrarModal("Hay mas roles seleccionados que jugadores en la partida, estas seguro que quieres empezar?")
        }else{
            startGame()
        }

    }

    if (parts[0] === "game-closed") {

        alert("Game closed")
        window.location.href = "../";

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

async function gameSequence() {
    // const roles = [
    //     "aldeano", "angel", "bruja", "caballero", "cupido", "domador_de_osos", "gitana", 
    //     "hombre_lobo", "hombre_lobo_albino", "juez_tartamudo", "ladron", "niña", "niño_salvaje", 
    //     "padre_lobo", "protector", "sirvienta", "vidente", "zorro"
    // ];

    // Preparación previa de la partida
    speak("Revisa tu rol en tu dispositivo");
    await countDown(10.0);
    speak("El pueblo duerme...");
    await countDown(5.0);

    // Primera noche - personajes específicos
    speak("Separación de la aldea en 2 grupos para el sectario.");
    await countDown(5.0);

    if (roles.includes("cupido")) {
        speak("Cupido enamora a dos jugadores.");
        await countDown(5.0);
        speak("Los enamorados despiertan y se reconocen.");
        await countDown(5.0);
    }

    if (roles.includes("gemelas")) {
        speak("Las Gemelas se reconocen.");
        await countDown(5.0);
    }

    if (roles.includes("trillizos")) {
        speak("Los Trillizos se reconocen.");
        await countDown(5.0);
    }

    if (roles.includes("niño_salvaje")) {
        speak("El Niño Salvaje decide a quién imitar.");
        await countDown(5.0);
    }

    if (roles.includes("domador_de_osos")) {
        speak("El Cazador de Osos despierta para que el narrador lo identifique.");
        await countDown(5.0);
    }

    if (roles.includes("perro_lobo")) {
        speak("El Perro Lobo despierta para comunicarle al narrador a qué bando pertenece.");
        await countDown(5.0);
    }

    if (roles.some(role => ["hombre_lobo", "hombre_lobo_albino", "padre_lobo"].includes(role))) {
        speak("Los Hombres Lobo despiertan y se reconocen, pero no saben quién es quién.");
        await countDown(5.0);
        speak("Los Hombres Lobo duermen, y Hombre Lobo, Hombre Lobo Feroz y Padre de los Hombres Lobo levantan el pulgar.");
        await countDown(5.0);
    }

    if (roles.includes("vidente")) {
        speak("La Vidente despierta y los identifica.");
        await countDown(5.0);
    }

    if (roles.includes("angel")) {
        speak("El Ángel despierta. La Vidente y la Gitana levantan el pulgar. Las identifica.");
        await countDown(5.0);
    }

    // Acciones repetitivas de todas las noches
    while (true) {
        if (roles.includes("ladron")) {
            speak("El Ladrón decide si roba alguna carta.");
            await countDown(5.0);
        }

        if (roles.includes("zorro")) {
            speak("El Zorro señala un grupo de 3 personas juntas. El narrador asiente o niega con la cabeza.");
            await countDown(5.0);
        }

        if (roles.includes("protector")) {
            speak("Protector: decide a quién va a proteger o blindar en este turno.");
            await countDown(5.0);
        }

        speak("Todos los Hombres Lobo despiertan y asesinan.");
        await countDown(5.0);

        if (roles.includes("hombre_lobo_feroz")) {
            speak("Hombre Lobo Feroz: Caza de nuevo él solo.");
            await countDown(5.0);
        }

        if (roles.includes("padre_lobo")) {
            speak("Padre de todos los Hombres Lobo: ¿Utiliza su poder? Sólo una vez por partida.");
            await countDown(5.0);
        }

        if (roles.includes("bruja")) {
            speak("La bruja decide si utiliza alguna poción.");
            await countDown(5.0);
        }

        // El día
        speak("Descubrimiento de las víctimas.");
        await countDown(5.0);

        if (roles.includes("domador_de_osos")) {
            speak("Gruñido del oso.");
            await countDown(5.0);
        }

        speak("Debate.");
        await countDown(5.0);
        speak("Linchamiento.");
        await countDown(5.0);

        if (roles.includes("sirvienta")) {
            speak("¿Sirvienta? Puede utilizar su poder o no.");
            await countDown(5.0);
        }

        if (roles.includes("juez_tartamudo")) {
            speak("Segundo voto si el Juez lo decide.");
            await countDown(5.0);
        }

        speak("Cae de nuevo la noche.");
        await countDown(5.0);
    }
}

async function countDown(time) {
    return new Promise((resolve) => {
        const countdownElement = document.getElementById('countdown');
        document.getElementById("setting").style.display = "none";

        let countdownNumber = time * speed;
        let isPaused = false;

        const countdown = setInterval(() => {
            countdownElement.style.display = 'flex';

            if (!isPaused) {
                countdownElement.textContent = parseInt(countdownNumber);
                countdownNumber = countdownNumber - 0.1;

                if (countdownNumber < 0) {
                    clearInterval(countdown);
                    countdownElement.textContent = "¡Tiempo!";
                    countdownElement.style.display = "none";
                    resolve();  // Resuelve la promesa cuando la cuenta regresiva termina
                }
            } else {
                countdownElement.textContent = "⏸️";
            }
        }, 100);

        // Permitir pausar/reanudar la cuenta regresiva
        document.body.addEventListener('click', () => {
            isPaused = !isPaused;
        });
    });
}

function togglePause() {
    isPaused = !isPaused;
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } else {
        console.log("API de síntesis de voz no soportada en este navegador.");
    }
}

function updatePhaseSpeed() {
    const selectElement = document.getElementById('phaseSpeed');
    const selectedValue = selectElement.value;

    if (selectedValue === 'slow') {
        speed = 1.25;
    } else if (selectedValue === 'normal') {
        speed = 1;
    } else if (selectedValue === 'fast') {
        speed = 0.75;
    }

    console.log('Phase Speed updated to:', speed);
}

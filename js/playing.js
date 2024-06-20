let socket 
addEventListeners()

function showSection(sectionId) {
    // Oculta todas las secciones
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });

    // Muestra la sección seleccionada
    var activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}


function addEventListeners(){
    document.getElementById("formJoin").addEventListener("submit", async (event) => {
        event.preventDefault()
        joinGame()
        
    })
}

async function joinGame(){
    let codigo =  document.getElementById("gameCode").value

    let url = 'http://localhost:8000/join-game'

    let json = {
        "codeRoom":codigo,
        "mail":localStorage.getItem("currentMail"),
        "name":localStorage.getItem("currentUser")
    }

    console.log(json)

    const response = await fetch(url, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json" // TODO Why is it working?
        },
        body: JSON.stringify(json),
        });
        
        if(response.status == 200){
            console.log(await response.text())
            initializeWebSocket(codigo)
        }else{
            alert("Codigo incorrecto")
        }
}

async function initializeWebSocket(codigo){
    return new Promise((resolve) =>{
        socket = new WebSocket('ws://localhost:8000');
    
        // Evento de conexión exitosa
        socket.addEventListener('open', function (event) {
          console.log('Conectado al servidor WebSocket');
          socket.send(`register/${codigo}/${localStorage.getItem("currentMail")}`)
        });
        
        // Evento de mensaje recibido
        socket.addEventListener('message', function (event) {
          console.log('Mensaje del servidor:', event.data);
        //   addMessageToChat(event.data);
        });
        
        // Evento de cierre de conexión
        socket.addEventListener('close', function (event) {
          console.log('Desconectado del servidor WebSocket');
        });
        resolve()
    })


}

// Función para enviar mensajes al servidor
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  socket.send(message);
  messageInput.value = '';
//   addMessageToChat('Yo: ' + message);
}

// Función para agregar mensajes al chat en la interfaz
// function addMessageToChat(message) {
//   const messages = document.getElementById('messages');
//   const li = document.createElement('li');
//   li.textContent = message;
//   messages.appendChild(li);
// }

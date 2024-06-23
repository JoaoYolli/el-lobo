let socket
let codigo

window.addEventListener('load', async () => {
    
    codigo = await createGameReq()
    console.log(codigo)
    
});

async function createGameReq(){
    return new Promise(async (resolve) => {
        console.log("BOTON")
        let url = 'http://localhost:8000/host-game'
    
        const json = {};
    
            const response = await fetch(url, {
                method: "POST",
                mode: "cors", // no-cors, *cors, same-origin
                headers: {
                  "Content-Type": "text/plain"
                },
                body: JSON.stringify(json),
                });
                if(response.status == 200){
                    let respuesta =  JSON.parse(await response.text())
                    document.getElementById("gameCode").innerHTML = respuesta["content"]
                    await initializeWebSocket(respuesta["content"])
                    resolve(respuesta["content"])
                }

    })
}

async function startGame(){

    console.log(socket)

    socket.send(`start-game/${codigo}`)

}

async function initializeWebSocket(codigo){
    return new Promise((resolve) =>{
        socket = new WebSocket('ws://localhost:8000');
    
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

function identifyMessageFromServer(message){
    let parts = message.split("/")
    let lista = document.getElementById("playersList")
    lista.innerHTML = "<p>Players List</p>"
    if(parts[0] === "PlayerUpdated"){
        for(let i = 1 ; i <= parts.length ; i++ ){
            if(parts[i]){
                lista.innerHTML = lista.innerHTML + "<p>"+ parts[i] +"</p>"
            }
        }
    }
    if(parts[0] === "roles-shown"){

        setTimeout(() => {
            console.log("Start now the game")
        },5000)

    }

}

function copy() {
    let cod = document.getElementById("gameCode")

    navigator.clipboard.writeText(cod.innerHTML)
    
    let elemento = document.getElementsByClassName("toast")[0]
    elemento.className = elemento.className.replace("invisible", "visible")

}

function closeToast(){
    let elemento = document.getElementsByClassName("toast")[0]
    elemento.className = elemento.className.replace("visible", "invisible")
}

// const toastTrigger = document.getElementById('liveToastBtn')
// const toastLiveExample = document.getElementById('liveToast')

// if (toastTrigger) {
//   const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
//   toastTrigger.addEventListener('click', () => {
//     toastBootstrap.show()
//   })
// }

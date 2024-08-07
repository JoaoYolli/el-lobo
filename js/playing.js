let socket
init()

async function init(){
  
  addEventListeners()
  showSection("join")
  if(localStorage.getItem("token") !== null && await checkToken(localStorage.getItem("token"))){
          
  }else{
      window.location.href = "../pages/login.html";
  }
}

async function checkToken(token){

  let url = properties["protocol"]+properties["url"]+properties["port"]+'/check-token'
  
  return new Promise(async (resolve) => {
      const response = await fetch(url, {
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            "Content-Type": "application/json" // TODO Why is it working?
          },
          body: JSON.stringify({"token":token}),
          });
          
          if(response.status == 200){
              let respuesta = response.text()
              console.log(respuesta)
              sessionStorage.setItem("currentUser",JSON.parse(await respuesta)["userName"])
              sessionStorage.setItem("currentMail",JSON.parse(await respuesta)["userMail"])
              resolve(true)

          }else{
              resolve(false)
          }
  })
 
}

function showSection(sectionId) {
  // Oculta todas las secciones
  var sections = document.getElementById('body').children;
  console.log(sections)

  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove('active');
  }

  // Muestra la sección seleccionada
  var activeSection = document.getElementById(sectionId);
  activeSection.classList.add('active');
}


function addEventListeners() {
  document.getElementById("formJoin").addEventListener("submit", async (event) => {
    event.preventDefault()
    joinGame()

  })
}

async function joinGame() {

  return new Promise(async (resolve) => {

    let codigo = document.getElementById("gameCode").value

    codigo = codigo.toUpperCase()

    let url = properties["protocol"]+properties["url"]+properties["port"]+'/join-game'

    let json = {
      "codeRoom": codigo,
      "mail": sessionStorage.getItem("currentMail"),
      "name": sessionStorage.getItem("currentUser")
    }

    console.log(json)

    let spinner = document.getElementById("loadSpinner")
    spinner.classList.add("overlay")

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(json),
      });

      if (response.status == 200) {
        console.log(await response.text())
        initializeWebSocket(codigo)
        showSection("waiting")
        spinner.classList.remove("overlay")
      } else {
        spinner.classList.remove("overlay")
        alert("Codigo incorrecto")
      }
      
    } catch (error) {
      spinner.classList.remove("overlay")
      joinGame()
    }

  })
}

async function initializeWebSocket(codigo) {
  return new Promise((resolve) => {
    socket = new WebSocket('ws://'+properties["url"]+properties["port"]);

    // Evento de conexión exitosa
    socket.addEventListener('open', function (event) {
      console.log('Conectado al servidor WebSocket');
      socket.send(`register/${codigo}/${sessionStorage.getItem("currentMail")}`)
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
  if (parts[0] == "set-screen") {
    showSection(parts[1])
    if (parts[1] == "showRole") {
      setRoleImage(parts[2])
      vibrateDevice([100,200,100])
    }
  }
  if (parts[0] == "host-disconnected") {
    alert("Host disconnected");
    window.location.href = "../index.html";
  }

}

function setRoleImage(role) {
  let img = document.getElementById("roleImg")
  let text = document.getElementById("roleName")
  switch (role) {
    case "aldeano":
      img.style.backgroundImage = "url(../source/images/aldeano.png)"
      text.innerHTML = "Aldeano"
      console.log(img.style.backgroundImage)
      console.log(role)
      break;
    case "angel":
      img.style.backgroundImage = "url(../source/images/angel.png)";
      text.innerHTML = "Ángel";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "bruja":
      img.style.backgroundImage = "url(../source/images/bruja.png)";
      text.innerHTML = "Bruja";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "caballero":
      img.style.backgroundImage = "url(../source/images/caballero.png)";
      text.innerHTML = "Caballero";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "cupido":
      img.style.backgroundImage = "url(../source/images/cupido.png)";
      text.innerHTML = "Cupido";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "domador_de_osos":
      img.style.backgroundImage = "url(../source/images/domadorOsos.png)";
      text.innerHTML = "Domador de Osos";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "gitana":
      img.style.backgroundImage = "url(../source/images/gitana.png)";
      text.innerHTML = "Gitana";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "hombre_lobo":
      img.style.backgroundImage = "url(../source/images/hombreLobo.png)";
      text.innerHTML = "Hombrelobo";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "hombre_lobo_albino":
      img.style.backgroundImage = "url(../source/images/hombreLoboAlbino.png)";
      text.innerHTML = "Hombrelobo Albino";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "juez_tartamudo":
      img.style.backgroundImage = "url(../source/images/juezTartamudo.png)";
      text.innerHTML = "Juez Tartamudo";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "ladron":
      img.style.backgroundImage = "url(../source/images/ladron.png)";
      text.innerHTML = "Ladrón";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "niña":
      img.style.backgroundImage = "url(../source/images/niña.png)";
      text.innerHTML = "Niña";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "niño_salvaje":
      img.style.backgroundImage = "url(../source/images/niñoSalvaje.png)";
      text.innerHTML = "Niño Salvaje";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "padre_lobo":
      img.style.backgroundImage = "url(../source/images/padreLobo.png)";
      text.innerHTML = "Padre Lobo";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "protector":
      img.style.backgroundImage = "url(../source/images/protector.png)";
      text.innerHTML = "Protector";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "sirvienta":
      img.style.backgroundImage = "url(../source/images/sirvienta.png)";
      text.innerHTML = "Sirvienta";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "vidente":
      img.style.backgroundImage = "url(../source/images/vidente.png)";
      text.innerHTML = "Vidente";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
    case "zorro":
      img.style.backgroundImage = "url(../source/images/zorro.png)";
      text.innerHTML = "Zorro";
      console.log(img.style.backgroundImage);
      console.log(role);
      break;
  }
}

// Función para enviar mensajes al servidor
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  socket.send(message);
  messageInput.value = '';
  //   addMessageToChat('Yo: ' + message);
}

function vibrateDevice(pattern) {
  if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
  } else {
      console.log("La API de vibración no es compatible con este dispositivo.");
  }
}

window.addEventListener('load', async () => {
    
    let codigo = await createGameReq()
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
                    resolve(respuesta)
                }

    })
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

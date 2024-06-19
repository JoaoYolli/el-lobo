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
                    resolve(response.text)
                }

    })
}

function host(){
    window.location.href = "../pages/hosting.html";
}
async function join(){
    // console.log(localStorage.getItem("currentUser"))
    if(localStorage.getItem("token") !== null && await checkToken(localStorage.getItem("token"))){
        window.location.href = "../pages/playing.html";
    }else{
        window.location.href = "../pages/login.html";
    }
    
}

async function checkToken(token){

    let url = 'http://localhost:8000/check-token'
    
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
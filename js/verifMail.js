function verifMailEventListener(){
    
    var urlParams = new URLSearchParams(window.location.search);
    var mail = urlParams.get('mail');
    let url = 'http://localhost:8000/verify-code'
    console.log("BOTON", mail)
    
    document.getElementById("text").innerHTML = `Se ha enviado un código de confirmación a <strong id="user-email">${mail}</strong>.`;
    
    document.getElementById("verification-form").addEventListener("submit", async (event) => {
        event.preventDefault()

        const mailJSON = {"mail":mail, "code":document.getElementById("verification-code").value};
        console.log(mailJSON)

        const response = await fetch(url, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "text/plain" // TODO Why is it working?
            },
            body: JSON.stringify(mailJSON),
            });
            
            if(response.status == 200){
                createUserRequest(mail, document.getElementById("user-name").value)
            }else{
                alert("Codigo incorrecto")
            }
        
    })
    
}

async function createUserRequest(mail, akka){

    console.log("CREATE USER")
    let url = 'http://localhost:8000/create-user'

        const mailJSON = {"mail":mail, "akka":akka};
        console.log(mailJSON)

        const response = await fetch(url, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "text/plain"
            },
            body: JSON.stringify(mailJSON),
            });
            if(response.status == 200){
                window.location.href= "../pages/playing.html"
            }else{
                alert("Error al loggear, intentelo mas tarde")
            }

}
verifMailEventListener()
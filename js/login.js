function submitMailEventListener(){
    console.log("BOTON")
    let url = 'http://localhost:8000/send-mail'
    
    document.getElementById("formMail").addEventListener("submit", async (event) => {
        event.preventDefault()
        const mailJSON = {"mail":document.querySelector("input").value};

        const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(mailJSON),
            });
            if(response.status == 200){
                window.location.href= "../pages/verifMail.html"
            }
        
    })
    
}

submitMailEventListener()

// window.addEventListener('DOMContentLoaded', () => {
//     console.log("AAAAAAAAAAAAAAAAAAAAAA")
// })
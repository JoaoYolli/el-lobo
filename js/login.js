function submitMailEventListener(){
    console.log("BOTON")
    let url = 'http://81.34.175.196:8012/send-mail'
    
    document.getElementById("formMail").addEventListener("submit", async (event) => {
        event.preventDefault()
        const mailJSON = {"mail":document.getElementById("inputLogin").value};

        const response = await fetch(url, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(mailJSON),
            });
            if(response.status == 200){
                window.location.href= `../pages/verifMail.html?mail=${document.getElementById("inputLogin").value}&name=${JSON.parse(await response.text())["content"]}`
            }
        
    })
    
}

submitMailEventListener()

// window.addEventListener('DOMContentLoaded', () => {
//     console.log("AAAAAAAAAAAAAAAAAAAAAA")
// })
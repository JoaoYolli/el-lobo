function host(){
    window.location.href = "../pages/hosting.html";
}
function join(){
    console.log(localStorage.getItem("currentUser"))
    if(localStorage.getItem("currentUser") !== null){
        window.location.href = "../pages/playing.html";
    }else{
        window.location.href = "../pages/login.html";
    }
    
}
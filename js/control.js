function host(){
    window.location.href = "../pages/hosting.html";
}
function join(){
    window.location.href = "../pages/login.html";
}
function submitMail(){
    const urlParams = new URLSearchParams(window.location.search);
    console.log( urlParams.get('email') );
}
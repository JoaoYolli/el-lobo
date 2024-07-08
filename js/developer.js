let currentGameRow = ""
init()

async function init(){

    let accounts = await getAccounts()
    displayAccounts(accounts)

    let games = await getGames()
    displayGames(games)

}

async function getAccounts(){

    return new Promise(async (resolve) => {
        let urlParams = new URLSearchParams(window.location.search);
        let auth = urlParams.get('auth');

        let url = properties["protocol"]+properties["url"]+properties["port"]+'/getAccounts/'+auth

        const response = await fetch(url, {
            method: "GET",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "application/json" // TODO Why is it working?
            }
            });
            
            if(response.status == 200){
                
                resolve(JSON.parse(await response.text())["content"])
  
            }else{
                alert("UNAUTHORIZED")
                window.location.href = "../";
            }
            resolve()

    })

}

async function getGames(){

    return new Promise(async (resolve) => {
        let urlParams = new URLSearchParams(window.location.search);
        let auth = urlParams.get('auth');

        let url = properties["protocol"]+properties["url"]+properties["port"]+'/getGames/'+auth

        const response = await fetch(url, {
            method: "GET",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "application/json" // TODO Why is it working?
            }
            });
            
            if(response.status == 200){
                
                resolve(JSON.parse(await response.text())["content"])
  
            }else{
                alert("UNAUTHORIZED")
                window.location.href = "../";
            }
            resolve()

    })

}

async function displayAccounts(accounts){

    return new Promise((resolve) => {

        let lista = document.getElementById("listaCuentas")

        const arrayOfUsers = JSON.parse(accounts);

        arrayOfUsers.forEach(account => {

            const listItem = document.createElement('li');
            listItem.id = account.akka
            //Para marcar o desmarcar el usuario desde la lista de usuarios
            listItem.addEventListener('click', (event) => {
                event.stopPropagation();
                let aResaltar = document.getElementById("inGame-"+account.mail)
                if(aResaltar.style.backgroundColor == 'lightyellow'){
                    aResaltar.style.backgroundColor = "#f9f9f9";
                    aResaltar.style.cursor = 'auto';
                }else{
                    aResaltar.style.backgroundColor = 'lightyellow';
                    aResaltar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    aResaltar.style.cursor = 'pointer';
                }
            }); 
            listItem.style.cursor = 'pointer';
            listItem.textContent = `${account.akka} (${account.mail})`;
            lista.appendChild(listItem);
            
        });

        resolve()
    })

}

async function displayGames(games){
    return new Promise((resolve) => {
        const gamesData = JSON.parse(games);

        const gameBody = document.querySelector('.game-body');

        for (const [game, players] of Object.entries(gamesData)) {
            const row = document.createElement('tr');
            const gameCell = document.createElement('td');
            gameCell.textContent = `Partida ${game}`;
            const playersCell = document.createElement('td');
            const playerList = document.createElement('ul');
            playerList.classList.add('player-list');

            players.forEach(playerMail => {
                const listItem = document.createElement('li');
                listItem.textContent = playerMail; // Puedes modificar esto para mostrar más información
                listItem.id = "inGame-"+playerMail
                //Para desmarcar el usuario
                listItem.addEventListener('click', (event) => {
                    event.stopPropagation();
                    let aResaltar = document.getElementById("inGame-"+playerMail)
                    if(aResaltar.style.backgroundColor == 'lightyellow'){
                        aResaltar.style.backgroundColor = "#f9f9f9";
                        aResaltar.style.cursor = 'auto';
                    }
                }); 
                playerList.appendChild(listItem);
            });

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                showMenu(row,`"${game}"`);
            });
            actionsCell.appendChild(deleteButton);

            playersCell.appendChild(playerList);
            row.appendChild(gameCell);
            row.appendChild(playersCell);
            row.appendChild(actionsCell);
            gameBody.appendChild(row);
        }

        resolve()
    })
}

function showMenu(row, game) {
    currentGameRow = game;
    const rect = row.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.style.display = 'block';
}

function hideMenu() {
    menu.style.display = 'none';
}

async function deleteGame(){

    return new Promise(async (resolve) => {
        let urlParams = new URLSearchParams(window.location.search);
        let auth = urlParams.get('auth');

        let url = properties["protocol"]+properties["url"]+properties["port"]+'/deleteGame/'+auth

        let json = {game: currentGameRow}

        const response = await fetch(url, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "application/json" // TODO Why is it working?
            },
            body: JSON.stringify(json),
            });
            
            if(response.status == 200){
                
                window.location.reload();
  
            }else{
                alert("UNAUTHORIZED")
                hideMenu()
            }
            resolve()

    })

}
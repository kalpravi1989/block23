const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2306-FTB-MT-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players`);
        const player = await response.json();
        return player;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response=await fetch(`${APIURL}players/${playerId}`);
        const singlePlayer=await response.json();
        return(singlePlayer.data.player);
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};
const renderSInglePlayerByID=async(id)=>{
    try{
        const singlePlayer=await fetchSinglePlayer(id);
        console.log(singlePlayer);
        console.log(singlePlayer.id);
        console.log(singlePlayer.name);
        const playerDetailsElement = document.createElement('div');

        playerDetailsElement.classList.add('player-details');
        playerDetailsElement.innerHTML = `
                <h2>${singlePlayer.id}</h2>
                <p>${singlePlayer.name}</p>
                <p>${singlePlayer.breed}</p>
                <p>${singlePlayer.status}</p>
                <p>${singlePlayer.createdAt}</p>
                <button class="close-button">Close</button>
            `;
        playerContainer.appendChild(playerDetailsElement);
    
        // add event listener to close button
        const closeButton = playerDetailsElement.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
          playerDetailsElement.remove();
        });
    }catch(err){

    }
}

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}players`, {
            method: 'POST',
            body: JSON.stringify(playerObj), 
            headers: {
                'Content-Type': 'application/json', 
            }
        });
        const playerres = await response.json();
        console.log(playerres);

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        let response = await fetch(`${APIURL}players/${playerId}`, {
            method: "DELETE",
        });
       const players=await fetchAllPlayers();
       await renderAllPlayers(players.data.players);

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async(playerList) => {
    try {
        playerContainer.innerHTML='';
        playerList.forEach((players)=>{
        const playerElement=document.createElement('div');
        playerElement.classList.add('player');
        playerElement.innerHTML=`
        <h4>Name  :${players.name}</h4>
        <p>ID    :${players.id}</p>
        <p>Breed :${players.breed}</p>
        <p>Status:${players.status}</p>
        <img src=${players.imageUrl} alt="dog img">
        <button class="details-button" data-id="${players.id}">See Details</button>
        <button class="delete-button" data-id="${players.id}">Delete</button>
        `;
        playerContainer.appendChild(playerElement);
        const detailsButton = playerElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        console.log("id :",event.target.dataset.id);
        renderSInglePlayerByID(event.target.dataset.id);
    });
     //delete player
     const deleteButton = playerElement.querySelector('.delete-button');
     deleteButton.addEventListener('click', async (event) => {
        removePlayer(event.target.dataset.id);

        });
    });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        //newPlayerFormContainer
        const formHTML=`
        <form method="POST">
        <h3>Create new player</h3>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="name"><br>
        <label for="id">Id</label>
        <input type="text" id="id" name="id" placeholder="id"><br>
        <label for="breed">Breed</label>
        <input type="text" id="breed" name="breed" placeholder="Breed"><br>
        <p>Status</p>
        <input type="radio" id="bench" name="status" value="bench">
        <label for="bench">Bench</label><br>
        <input type="radio" id="field" name="status" value="field">
        <label for="field">Field</label><br> 
       
        <label for="image_url">Image URL</label>
        <input type="text" id="image_url" name="image_url" placeholder="Image URL"><br>

        <button type="submit">Create</button>
        </form>
        `;
        newPlayerFormContainer.innerHTML=formHTML;
        const form = document.querySelector('form');
        form.addEventListener('submit', function(event) { 
            event.preventDefault();
            const playerData = {
                name: form.name.value,
                id: form.id.value,
                breed: form.breed.value,
                status: form.status.value,
                image_url: form.image_url.value,
               
            }
            console.log(playerData);
            addNewPlayer(playerData);
            form.reset();
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
   console.log(players.data.players);
    console.log(players);
   await renderAllPlayers(players.data.players);
  renderNewPlayerForm();
}

init();
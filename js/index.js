//call function
submitForm();

//handles submit event and grabs the value inputted by the user
function submitForm() {
    //grab necessary DOM nodes
    const form = document.querySelector('form');
    const input = document.querySelector('#search');

    //event listener for when form is submitted, prevent default added so no automatic reload
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        //check if there is a previous search displayed and remove from dom
        const list = document.querySelector('#user-list');
        if (list.hasChildNodes()) {
            const users = list.querySelectorAll('li');
            for(const user of users) {
                user.remove();
            }
        }

        //send the user inputed to the searchUser function and reset form
        searchUser(input.value);
        form.reset();
    });
}

//send a get request to the git api and send data received to displayUser function
function searchUser(userName) {
    fetch(`https://api.github.com/search/users?q=${userName}`, {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/vnd.github.v3+json',
        },
    })
    .then(response => response.json())
    .then(object => displayUser(object));
}

//loop and through each user found through search and display on dom
function displayUser(object) {
    userList = object.items;
    for (const user of userList) {
        const userLI = document.createElement('li');
        userLI.innerHTML = `
        <p id='${user.login}'>Username: ${user.login}</p>
        <p>Account URL: ${user.html_url}<\p><br>
        `
        document.querySelector('#user-list').appendChild(userLI);

        //add event listener to each user and when clicked handle the event
        userLI.addEventListener('click', handlerUserClick);
    }
}

//handles event when user is clicked
function handlerUserClick(event) {
    //check if there is are previous repos displayed and remove from dom
    const list = document.querySelector('#repos-list');
    if (list.hasChildNodes()) {
        const repos = list.querySelectorAll('li');
        for(const repo of repos) {
            repo.remove();
        }
    }

    //send a get request to the git api and send data received to displayRepos function
    const username = event.target.parentNode.querySelector('p');
    fetch(`https://api.github.com/users/${username.id}/repos`, {
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/vnd.github.v3+json',
        },
    })
    .then(response => response.json())
    .then(object => displayRepos(object));
}

//loop and through each repo found of user that was clicked and display on dom
function displayRepos(object) {
    for (const repo of object) {
        const repoLI = document.createElement('li');
        repoLI.innerHTML = `
        <p id='${repo.name}'>Repository Name: ${repo.name}</p>
        <p>Repository URL: ${repo.html_url}<\p><br>
        `
        document.querySelector('#repos-list').appendChild(repoLI);
    }
}

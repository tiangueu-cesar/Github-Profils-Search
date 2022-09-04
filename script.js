const APIURL = 'https://api.github.com/users/'


const main = document.getElementById('content');
const form = document.getElementById('form');
const search = document.getElementById('search');




async function getUserInformation (username) {

    try {
            const { data } = await axios(APIURL + username);

            displayUserData(data);
            getRepos(username);

    } catch (err) {
        cardError('No profile with this username');
    }

}


async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')

        addReposToCard(data);
    } catch (error) {
        cardError('Problem fetching repos');
    }
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');

    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerHTML = repo.name;

            reposEl.appendChild(repoEl);

        })
}


function cardError (errorMessage) {
    const cardHTML = `
        <div class="card">
            <h1>${errorMessage}</h1>
        </div>
    `
}


function displayUserData(data) {
    const userId = data.name || data.login
    const userBio = data.bio ? `<p>${data.bio}</p>`: ''

    const cardHTML = `
        <div class="card">
            <div class="bild">
                <img src="${data.avatar_url}" alt="${data.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${userId}</h2>
                ${userBio}
                <ul>
                    <li>${data.followers} <strong>Followers</strong></li>
                    <li>${data.following} <strong>Following</strong></li>  
                    <li>${data.public_repos} <strong>Repos</strong></li>
                </ul>

                <div id="repos">
                </div>
            </div>
        </div>
    `

    main.innerHTML = cardHTML

}

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const user = search.value;
    
    if (user) {
        getUserInformation(user)

        search.value = ' ';
    } 

});
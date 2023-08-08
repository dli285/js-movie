//Titles
//Details
 
const searchList = document.querySelector('.search-list') 
const resultGrid = document.querySelector('.result-grid') 
 
//movies from API 
function findMovies() {
    const searchTerm = document.querySelector('.search-input').value;
    fetch(`http://www.omdbapi.com/?s=${searchTerm}&apikey=c93568ff`)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.error('Ошибка:', error));
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; //setting movie id in data-id
        movieListItem.classList.add('search-list-item')
             if (movies[idx].Poster != "N/A")
                moviePoster = movies[idx].Poster
            else
                moviePoster = "not_found.avif"

        movieListItem.innerHTML = `
            <div class= "search-img">
                <img src= "${moviePoster}"> 
            </div>
            <div class= "search-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div> 
            `
        searchList.appendChild(movieListItem)   
    }
    loadMovieDetails() 
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-element')
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list')
            movieSearchBox.value = ""
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=c93568ff`)
            const movieDetails = await result.json()
            displayMovieDetails(movieDetails)
        })
    })
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class="movie-title">
        <h3 class="movie-title">${details.Title}</h3>
    </div>
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : not_found.avif}" alt="">
    </div>
    <div class="movie-info">
        <ul class="movie-misc-info">
            <li class="year"><span class="li">Year:</span> ${details.Year}</li>
            <li class="ratings"><span class="li">Raitings:</span> ${details.Rated}</li>
            <li class="release-date"><span class="liэ">Release date:</span> ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writers:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b>Awards:</b> ${details.Awards}</p>
         </div>
    </div>    
    `
}

window.addEventListener('click', (event) => {
    if (event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
})
//Colors
document.querySelector('.checkbox-input').addEventListener('change', function() {
    if (this.checked) {
        document.body.setAttribute('data-theme', 'bright');
    } else {
        document.body.removeAttribute('data-theme');
    }
});
//Избранное
function addToFavorites(imdbID) {
    const favourite = getFavorites();
    if (!favourite.includes(imdbID)) {
        favourite.push(imdbID);
        localStorage.setItem('favourite', JSON.stringify(favourite));
        alert('Фильм добавлен в избранное!');
    } else {
        alert('Он уже в избранном!');
    }
}

function getFavorites() {
    const favourite = localStorage.getItem('favourite-button');
    return favourite ? JSON.parse(favourite) : [];
}

function displayFavorites() {
    const favourite = getFavorites();
    const favouritesList = document.getElementById('favoritesList');
    if (favourite.length) {
        favouritesList.innerHTML = 'Ожидание...';
        const promises = favourite.map(id => fetch(`http://www.omdbapi.com/?i=${id}&apikey=c93568ff`).then(response => response.json()));

        Promise.all(promises).then(movies => {
            let output = '';
            movies.forEach(movie => {
                output += `<div class= "search-img">
                <img src= "${movie.Poster}"> 
            </div>
            <div class= "search-info">
                <h3>${movies.Title}</h3>
                <p>${movies.Year}</p>
            </div>`;
            });
            favouritesList.innerHTML = output;
        });
    } else {
        favouritesList.innerHTML = 'У вас пока нет избранных фильмов.';
    }
}

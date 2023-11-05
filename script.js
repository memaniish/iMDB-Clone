const apiKey = "57ebc4ca";

// Get the search input element
const searchInput = document.getElementById("searchInput");

// Add an event listener to the search input for input changes
searchInput.addEventListener("input", searchMovies);

async function searchMovies(event) {
  const searchTerm = searchInput.value.trim();

  if (searchTerm !== "") {
    const searchResultContainer = document.getElementById(
      "searchResultsContainer"
    );
    searchResultContainer.innerHTML = "";

    // Construct the URL for fetching movie search results from the OMDb API
    const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      // Check if the response is successful and contains search results
      if (data.Response === "True" && data.Search) {
        // Iterate over each movie in the search results and create a movie element
        for (const movie of data.Search) {
          const movieElement = createMovieElement(movie, true, false);
          searchResultContainer.appendChild(movieElement);
        }
      } else {
        // Display a message if no results are found
        searchResultContainer.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      console.log(error);
      // Display an error message if an error occurs during the API request
      searchResultContainer.innerHTML =
        "<p>Error occurred. Please try again later.</p>";
    }
  }
}

// Function to create a movie element
function createMovieElement(
  movie,
  showBookmarkIcon = true,
  showDeleteIcon = true
) {
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-item");

  // Create the movie poster element
  const moviePoster = document.createElement("div");
  moviePoster.classList.add("fav-poster");

  // Create the poster image element and set its source and alt attributes
  const posterImage = document.createElement("img");
  posterImage.src =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://upload.wikimedia.org/wikipedia/commons/f/f9/No-image-available.jpg";
  posterImage.alt = movie.Title;

  // Append the poster image to the movie poster element
  moviePoster.appendChild(posterImage);

  // Append the movie poster element to the movie element
  movieElement.appendChild(moviePoster);

  // Create the movie details element
  const movieDetails = document.createElement("div");
  movieDetails.classList.add("fav-details");

  // Create the details box element
  const detailsBox = document.createElement("div");
  detailsBox.classList.add("fav-details-box");

  // Create the details content element
  const detailsContent = document.createElement("div");

  // Create the movie title element and its link
  const movieTitle = document.createElement("p");
  const movieTitleLink = document.createElement("a");
  movieTitleLink.href = `movie.html?id=${movie.imdbID}`;
  movieTitleLink.textContent = movie.Title;
  movieTitle.appendChild(movieTitleLink);
  detailsContent.appendChild(movieTitle);

  // Create the movie year element
  const movieYear = document.createElement("p");
  movieYear.textContent = movie.Year;
  detailsContent.appendChild(movieYear);

  // Append the details content to the details box
  detailsBox.appendChild(detailsContent);

  // Create and append the bookmark icon if showBookmarkIcon is true
  if (showBookmarkIcon) {
    const bookmarkIcon = document.createElement("i");
    bookmarkIcon.classList.add("fas", "fa-bookmark");
    bookmarkIcon.style.cursor = "pointer";
    bookmarkIcon.onclick = () => addToFavorites(movie.imdbID);
    detailsBox.appendChild(bookmarkIcon);
  }

  // Create and append the delete icon if showDeleteIcon is true
  if (showDeleteIcon) {
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("fas", "fa-trash");
    removeIcon.style.cursor = "pointer";
    removeIcon.onclick = () => removeFromFavorites(movie.imdbID);
    detailsBox.appendChild(removeIcon);
  }

  // Append the details box to the movie details
  movieDetails.appendChild(detailsBox);

  // Append the details box to the movie details
  movieElement.appendChild(movieDetails);

  // Return the created movie element
  return movieElement;
}

// Function to add a movie to favorites
function addToFavorites(movieID) {
  // Get the favorites from localStorage or initialize an empty array
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // If the movie ID is not already in favorites, add it and update localStorage
  if (!favorites.includes(movieID)) {
    favorites.push(movieID);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Movie added to Watchlist");
    loadFavorites();
  } else {
    // If the movie ID is already in favorites, remove it
    removeFromFavorites(movieID);
  }
}

// Function to remove a movie from favorites
function removeFromFavorites(movieID) {
  // Get the favorites from localStorage or initialize an empty array
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.indexOf(movieID);

  // If the movie ID is found in favorites, remove it and update localStorage
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Movie removed from Watchlist");
    loadFavorites();
  }
}

// Function to load and display favorite movies
async function loadFavorites() {
  const favoritesContainer = document.getElementById("favoriteMovies");
  favoritesContainer.innerHTML = "";

  // Get the favorites from localStorage or initialize an empty array
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length > 0) {
    // Iterate over each movie ID in favorites and fetch the movie details
    for (const movieID of favorites) {
      const movie = await fetchMovieById(movieID);

      if (movie) {
        // Create a movie element for each fetched movie and append it to the favorites container
        const movieElement = createMovieElement(movie, false);
        favoritesContainer.appendChild(movieElement);
      }
    }
  } else {
    // Display a message if no favorite movies are found
    favoritesContainer.innerHTML = "<p>No Favorite Movies Found</p>";
  }
}

// Function to fetch movie details by ID from the OMDb API
async function fetchMovieById(movieID) {
  const url = `https://www.omdbapi.com/?i=${movieID}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}

// Function to get and display movie details on the movie.html page
async function getMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("id");

  if (movieID) {
    const movie = await fetchMovieById(movieID);

    if (movie) {
      const movieDetailsContainer = document.getElementById("movieDetails");
      movieDetailsContainer.innerHTML = "";

      // Create and append the movie title element
      const movieTitle = document.createElement("h2");
      movieTitle.textContent = movie.Title;
      movieDetailsContainer.appendChild(movieTitle);

      // Create and append the movie poster element
      const moviePoster = document.createElement("img");
      moviePoster.src =
        movie.Poster !== "N/A" ? movie.Poster : "img/blank-poster.webp";
      moviePoster.alt = movie.Title;
      movieDetailsContainer.appendChild(moviePoster);

      // Create the movie info element and its child elements
      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");

      const movieRating = document.createElement("p");
      movieRating.textContent = `IMDb Rating: ${movie.imdbRating}`;
      movieInfo.appendChild(movieRating);

      const movieGenre = document.createElement("p");
      movieGenre.textContent = `Genre: ${movie.Genre}`;
      movieInfo.appendChild(movieGenre);

      const moviePlot = document.createElement("p");
      moviePlot.textContent = `Plot: ${movie.Plot}`;
      movieInfo.appendChild(moviePlot);

      // Append the movie info to the movie details container
      movieDetailsContainer.appendChild(movieInfo);
    } else {
      // Display a message if movie details are not found
      const movieDetailsContainer = document.getElementById("movieDetails");
      movieDetailsContainer.innerHTML = "<p>Movie details not found.</p>";
    }
  } else {
    // Display a message for an invalid movie ID
    const movieDetailsContainer = document.getElementById("movieDetails");
    movieDetailsContainer.innerHTML = "<p>Invalid movie ID.</p>";
  }
}

// Add an event listener to the search input for Enter key press
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchMovies();
    }
  });

// Perform actions based on the current page location
window.onload = function () {
  const currentLocation = window.location.pathname;
  if (currentLocation.includes("movie.html")) {
    // If the current page is movie.html, get and display movie details
    getMovieDetails();
  } else if (currentLocation.includes("favorite.html")) {
    // If the current page is favorite.html, load and display favorite movies
    loadFavorites();
  }
};
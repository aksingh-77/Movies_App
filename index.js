//--------------------------Variables Declaration and query Selector variables--------------//
const URL = "https://movies-app.prakashsakari.repl.co/api/movies";
const parentElement = document.querySelector(".main");
const searchInput = document.querySelector(".input");
const movieRatings = document.querySelector("#rating-select");
const moviesGenres = document.querySelector("#genre-select");

let searchValue = "";
let ratings = 0;
let genre = "";
let filteredArrOfMovies = [];
//=======================================================================================================================//




//========================================Promise Async await to fetch the data from api===================================//
const getMovies = async (url) => {
    try{
        // here {data} is directly extracting the the data from the object received from the api that's the reason behind the writing the data inside the {} i.e we destructured the data
        //with axios we don't need to convert the data into JSON, as the received object is in JSON format
        const {data} = await axios.get(url);
        return data;
    }
    catch(err){}
}
//here we are storing the value from the getMovies Object in the movies variable the movies will the a Promise object as async return's a promise
//here await will give gice the PromiseResult into movies directly, and not the whole promise object
let movies = await getMovies(URL);
//===============================================================================================================================//






//======================================functions and logic to create the movie card=============================================//
//an arrow function to create an element so that whenever we need to create an element we can call this function
const createElement = element => document.createElement(element);

const createMovieCard = (movies) => {
    for (let movie of movies){
        //Creating parent container for the card
        const cardContainer = createElement("div");
        cardContainer.classList.add("card", "shadow");

        //creating image container
        const imageContainer = createElement("div");
        imageContainer.classList.add("card-image-conatiner");

        //Creating card iamge
        const imageEle = createElement("img");
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src", movie.img_link);
        imageEle.setAttribute("alt", movie.name);
        imageContainer.appendChild(imageEle);

        cardContainer.appendChild(imageContainer);

        //creating card details container
        const cardDetails = createElement("div");
        cardDetails.classList.add("movies-details");

        //card Details
        const titleEle = createElement("p");
        titleEle.classList.add("title");
        titleEle.innerText = movie.name;
        cardDetails.appendChild(titleEle);

        //card Genre
        const genreEle = createElement("p");
        genreEle.classList.add("genre");
        genreEle.innerText = `Genre: ${movie.genre}`;
        cardDetails.appendChild(genreEle);

        //ratings and length container
        const movieRating = createElement("div");
        movieRating.classList.add("ratings");

        //star/Ratings Container
        const ratings = createElement("div");
        ratings.classList.add("star-rating");

        //span for the material icon
        const starIcon = createElement("span");
        starIcon.classList.add("material-icons-outlined");
        starIcon.innerText= "star";

        //rating Value in numbers
        const ratingValue = createElement("span");
        ratingValue.innerText = movie.imdb_rating;

        //appending the ratings part
        ratings.appendChild(starIcon);
        ratings.appendChild(ratingValue);
        movieRating.appendChild(ratings);

        //length
        const length = createElement("p");
        length.innerText = `${movie.duration} mins`;
        movieRating.appendChild(length);

        cardDetails.appendChild(movieRating);

        cardContainer.appendChild(cardDetails);

        parentElement.appendChild(cardContainer);

    }
};
//===============================================================================================================================//




//=======================Function to get the filtered array of basis on the basis the filters are applied==========================//
function getFilteredData(){

    //?. is optional chaning, this will check if the searchValue is not undefined and length is not 0
    filteredArrOfMovies = searchValue?.length > 0 ? movies.filter(
        (movie) =>  
        searchValue === movie.name.toLowerCase() || 
        searchValue === movie.director_name.toLowerCase() ||
        movie.writter_name.toLowerCase().split(",").includes(searchValue) ||
        movie.cast_name.toLowerCase().split(",").includes(searchValue)
    ) : movies;

        //conditon for ratings filter
        if(ratings > 0){
            filteredArrOfMovies = searchValue?.length > 0 && genre ? filteredArrOfMovies : movies;
            filteredArrOfMovies = filteredArrOfMovies.filter(movie => movie.imdb_rating > ratings);
        }
        

        //condition for genre filter
        if(genre?.length > 0 ){
            filteredArrOfMovies = searchValue?.length > 0 && ratings > 7 ? filteredArrOfMovies : movies;
            filteredArrOfMovies = filteredArrOfMovies.filter(movie => movie.genre.includes(genre));
        }

        return filteredArrOfMovies;
}
//=================================================================================================================================//






//============================Function for search input box=======================================================================//
//============================This is only executed when the input is entered in search box=====================================
function handleSearch(event){
     
    searchValue = event.target.value.toLowerCase();
    let filterBySearch = getFilteredData()
    
    parentElement.innerHTML = "";
    createMovieCard(filterBySearch);
    
}
//==================================================================================================================================//



//=============================================Debounce Method written for search input boc method=====================================//
// Debouncing is a programming practice used to ensure that time-consuming tasks do not fire so often, 
// that it stalls the performance of the web page. In other words, 
// it limits the rate at which a function gets invoked.
function debounce(callback, delay){
    let timerId;

    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(()=>{callback(...args)}, delay);
        
    };
}
const debounceInput = debounce(handleSearch, 700);
//========================================================================================================================================//




//===================================Function for Ratings Select DropDown Options==========================================================//
//function to handlke the filter dropdown for ratings
function handelRatingsSelector(event){
    ratings = event.target.value;
    // console.log(ratings);
    let filterByRating  = getFilteredData();
    parentElement.innerHTML = "";
    createMovieCard(ratings ? filterByRating : movies);
}
//============================================================================================================================================//



//===========================function to create the list of dropdown from api data for genre section===========================================//
//FILTER BY GENRE
//here to create the dropdown for the genres list we are fetching the list of genres from the api movies list
//we will make sure the array created is distinct and have no duplicate element
const genres = movies.reduce((acc, cur) => {
    let genresArr = []; //this will have all the unique value from the genres list 
    let tempGenresArr = []; // this will have all the genres from the api movies list i.e even duplicate list
    tempGenresArr = cur.genre.split(",");
    // console.log(tempGenresArr);
    acc = [...acc, ...tempGenresArr];
    for(let genre of acc){
        if(!genresArr.includes(genre)){
            genresArr = [...genresArr, genre];
        }
    }
    return genresArr;

},[] )
//=============================================================================================================================================//


//=================================Method To create html option tag for each genre fetched from api data========================================//
for(let genre of genres){
    const option = createElement("option");
    option.classList.add("option");
    option.setAttribute("value", genre);
    option.innerText = genre;
    moviesGenres.appendChild(option);
}
//=============================================================================================================================================//




//===================================Function to Genre select dropdown options=================================================================//
function handleGenreSelect(event){
    genre = event.target.value;
    console.log(genre);

    const filterdMovieByGenre = getFilteredData();
    console.log(filterdMovieByGenre);
    parentElement.innerHTML = "";
    createMovieCard(genre ? filterdMovieByGenre : movies);
}
//=============================================================================================================================================//


//===============================Event Listnener for the filters provided on app==============================================================//
searchInput.addEventListener("keyup", debounceInput);

movieRatings.addEventListener("change", handelRatingsSelector);

moviesGenres.addEventListener("change", handleGenreSelect);
//=============================================================================================================================================//


//To load the page with movieCard at the load of page for first time
createMovieCard(movies);

 

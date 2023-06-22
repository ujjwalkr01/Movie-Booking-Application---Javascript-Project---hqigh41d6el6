// import { isFlag } from "./LogIn.js";
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 4000);
}

//implementing the login..

// fetching the data from the api...
const API = "api_key=0ccf59483fedbdb430d11f784efcd6a0";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const baseUrl1 = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/w500";
const nowPlaying_url =
  "https://api.themoviedb.org/3/movie/now_playing?api_key=0ccf59483fedbdb430d11f784efcd6a0";

const movieDetailsUrl =
  "https://api.themoviedb.org/3/movie/385687?api_key=0ccf59483fedbdb430d11f784efcd6a0";

const moviesInThetor =
  "/discover/movie?primary_release_date.gte=2022-11-01&primary_release_date.lte=2023-03-30&";

const API_URL = baseUrl1 + moviesInThetor + API;
const SEARCH_URL = baseUrl1 + "/search/movie?" + API;

let listOfMovies = document.querySelector(".rows");

//fetching the data from the api...

let countofFlag = 0;
function loadingMovie(data, id = 0, isFlag = false) {
  // console.log(countofFlag);
  if (isFlag && countofFlag === 0) {
    countofFlag++;
    listOfMovies.innerHTML = "";
  }
  data.results.forEach((res) => {
    if (id === 0 || res.id === id) {
      const markUp = `
      
      <div class="movie">
      <img class="poster" src="${imgUrl}${res.poster_path}" alt="${
        res.original_title
      }"/>
      <h4 class="title">${res.original_title}</h4>
      <span class="lang">${res.original_language.toUpperCase()}</span>
      <span class="rating">&star; ${res.vote_average}</span>
    </div>
    
      `;

      listOfMovies.insertAdjacentHTML("beforeend", markUp);
    }
  });
}

const movieData = async function (url, id = 0, isFlag = false) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    let filterArr = [];
    if (isFlag) {
      countofFlag = 0;
      // filterArr.splice(0);
      data.results.forEach((res) => {
        let idgen = [];
        idgen = res.genre_ids.slice(0, 1);
        if (idgen.includes(id)) {
          console.log(res.id, res.original_title);
          loadingMovie(data, res.id, true);
          filterArr.push(res.id);
          console.log(filterArr, "hi");
        }
        if (res.id === id) {
          loadingMovie(data, res.id);
          filterArr.push(res.id);
        }
      });

      movieDetail(filterArr, true);
    } else {
      loadingMovie(data, id);
      const idArr = data.results.map((el, ind) => el.id);

      // console.log(idArr);
      movieDetail(idArr);
    }

    changeRatingColor();

    movieOverview();
  } catch (err) {
    console.error(err);
  }
};
movieData(nowPlaying_url);

//changing the rating color
function changeRatingColor() {
  let rating = document.querySelectorAll(".rating");

  rating.forEach((rate) => {
    if (parseInt(rate.textContent.slice(1)) > 6) {
      rate.style.color = "green";
    } else {
      rate.style.color = "yellow";
    }
  });
}

let arr = [];
let newArray = [];
let heading = document.querySelector(".hdng");
async function movieDetail(idArr, isFlag = false) {
  if (isFlag) {
    newArray = [];
    for (let i = 0; i < idArr.length; i++) {
      var res = await fetch(`${baseUrl}${idArr[i]}?${API}`);
      var data = await res.json();
      //console.log(data);
      //  console.log(data.genres[0,1,2].name);

      if (!newArray.includes(data.id)) {
        newArray.push({
          id: data.id,
          duration: data.runtime,
          genre: data.genres[0].name,
          overview: data.overview,
          title: data.original_title,
          language: data.original_language,
          rating: data.vote_average,
        });
      }
    }
    if (newArray.length === 0) {
      listOfMovies.innerHTML = "";
      heading.textContent = "Coming soon...";
    } else {
      heading.textContent = "Now Playing...";
    }
    //console.log(newArray);
    movieOverview(newArray, true);
  } else {
    for (let i = 0; i < idArr.length; i++) {
      var res = await fetch(`${baseUrl}${idArr[i]}?${API}`);
      var data = await res.json();

      if (!arr.includes(data.id)) {
        arr.push({
          id: data.id,
          duration: data.runtime,
          genre: data.genres[0].name,
          overview: data.overview,
          title: data.original_title,
          language: data.original_language,
          rating: data.vote_average,
        });
      }
    }

    movieOverview(arr);
  }
}

//implementing the movie description.....
const overview = document.querySelector(".overview-window");
const windowDiv = document.querySelector("#window");
const btnClose = document.querySelector(".btn--close-modal");
const body = document.querySelector("body");
const mainDiv = document.getElementById("main-container");
const parentDiv = document.getElementById("parent--container");
const offerBar = document.getElementById("p-container");
let main = document.getElementById("mainContainer");
let searchInp = document.getElementById("searchBox");
let searchBtn = document.getElementById("searchBtn");
let onPaymentPage = false;
function movieOverview(isFlag = false) {
  let movielist = document.querySelectorAll(".movie");

  // implementing the movie model window
  movielist.forEach((list, ind) => {
    list.addEventListener("click", function (e) {
      let price = Math.trunc(Math.random() * (300 - 250 + 1)) + 250;
      let poster = list.querySelector(".poster");
      let title = list.querySelector(".title");

      let lang = list.querySelector(".lang");
      let rating = list.querySelector(".rating");

      const markUp = `
       <div id="poster">
         <img src="${poster.getAttribute("src")}" alt="${title.textContent}" >
         <p>₹ ${price}</p>
         <button id="bookTicketbtn" type="submit">Book Tickets</button>
       </div>
      <div class="moviedetails">
        <h2>${title.textContent}</h2>
        <p class="rating">${rating.textContent} /10</p>
        <p>${lang.textContent}</p>
        <p>${
          isFlag ? newArray[ind].duration : arr[ind].duration
        } minutes <span>&bull;</span> <span>${
        isFlag ? newArray[ind].genre : arr[ind].genre
      }</span></p>
        <p>${isFlag ? newArray[ind].overview : arr[ind].overview}</p>        
        
      </div>
      
      `;
      windowDiv.innerHTML = markUp;
      overview.classList.remove("hidden");

      changeRatingColor();
      const btnBook = document.querySelector("#bookTicketbtn");

      //proceeding to the checkout page...
      btnBook.addEventListener("click", () => {
        parentDiv.classList.add("hidden");
        overview.classList.add("hidden");
        offerBar.classList.add("hidden");
        searchInp.classList.add("hidden");
        searchBtn.classList.add("hidden");
        let convFee = parseFloat(((price * 1.75) / 100).toFixed(2));

        const payment = `
       <div id="paymentSection" class="">
          <button type="submit" id="btnBack">Back</button>
          <div id="container">
          <div id="form1">
            <h1>Billing Details</h1>
            <h2 style="color: orangered">${title.textContent}</h2>
            <p>
              Classic Ticket
              <span id="perTickt">₹ ${price}</span>
            </p>
            <p for="noOfTicket">Number of tickets
            <input type="number" id="noOfTicket" value="1" /></p>
            <p>
              Convenience Fee(1.75%)<span  id="feePrice"
                >price</span
              >
            </p>
            <hr />
            <p>
              Sub total<span id="totalamnt">price</span>
            </p>
          </div>
      </div>
  
  
      <hr style="width: 70%; margin: auto; margin-top: 20px;">
      <div class="payment-main-container">
  
          <div class="payment-container">
              <h2>Credit/Debit Card</h2>
              <form id="payment-form">
                  <label for="card-number">Card Number:</label>
                  <input type="text" id="card-number" name="card-number" required>
  
                  <label for="expiration-date">Expiration Date:</label>
                  <input type="date" id="expiration-date" name="expiration-date" required>
  
                  <label for="cvv">CVV:</label>
                  <input type="text" id="cvv" name="cvv" required>
                  <h2>UPI</h2>
                  <label for="cvv">Upi Id </label>
                  <input type="text" id="cvv" name="cvv">
  
                  <input class="check" style="margin-top: 10px;" type="checkbox" required>
                  <span>Please read <span style="color: blue;  text-decoration: underline;">terms and condition</span>
                  </span>
  
                  <button id="payBtn" type="submit">Pay Now</button>
              </form>
          </div>
  
          <div class="payment-container">
              <img id="pay_image" src="http://clipart-library.com/img1/1247294.png" alt="">
          </div>
  
      </div>
      <h2 id="thank">Booking Sucessfull ! Thanks you your Booking Id : BK256411126</h2>
  
      <hr style="height: 0rem; background-color: rgb(77, 76, 76); ">
      </div>  
        `;
        mainDiv.innerHTML = payment;
        //implementing the tax...
        let ticketInput = document.getElementById("noOfTicket");
        let cnvFee = document.getElementById("feePrice");
        let totalamnt = document.getElementById("totalamnt");
        let perTicktPrice = document.getElementById("perTickt");
        totalamnt.textContent = `₹ ${price + Number(convFee)} `;

        cnvFee.textContent = "₹ " + convFee;
        noOfTicket.addEventListener("keydown", function (e) {
          //  console.log(e.key);
          if (e.key === "Enter") {
            let notickt = parseInt(ticketInput.value);
            let taxCal = parseFloat((convFee * notickt).toFixed(2));
            let ticketPrice = price * notickt;
            perTicktPrice.textContent = "₹ " + ticketPrice;
            cnvFee.textContent = "₹ " + taxCal;
            totalamnt.textContent = `₹ ${ticketPrice + taxCal} `;
          }
        });
        //Implementing the  back button functionality
        let backBtn = document.getElementById("btnBack");
        let paymentSect = document.getElementById("paymentSection");
        backBtn.addEventListener("click", function () {
          window.location.href = "index.html";
        });
        let cardNumber = document.getElementById("card-number");
        let expDate = document.getElementById("expiration-date");
        let cvv = document.getElementById("cvv");
        let upi = document.getElementById("upi");
        let btnPay = document.getElementById("payBtn");
        let thank_greet = document.getElementById("thank");

        btnPay.addEventListener("click", function (e) {
          e.preventDefault();
          if (
            (cardNumber.value.length === 16 &&
              expDate.value != "" &&
              cvv.value.length === 3) ||
            upi.vlaue !== ""
          ) {
            thank_greet.textContent = `Booking Sucessfull ! Enjoy  your movie with Booking Id : BK127894`;
            thank_greet.style.opacity = 1;

            setTimeout(() => {
              window.location.href = "index.html";
            }, 8000);
          }
        });
      });
    });
  });
  btnClose.addEventListener("click", function () {
    overview.classList.add("hidden");
  });
}

//implementing the search functionality...

function searchMovies() {
  var selectedGenre = [];

  const searchTerm = searchInp.value;

  if (searchTerm === "") {
    return;
  }
  selectedGenre = arr.filter((ele) => {
    if (ele.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return ele.id;
    }
  });
  listOfMovies.innerHTML = "";
  selectedGenre.forEach((ele) => {
    movieData(nowPlaying_url, ele.id, true);
  });
}
//https://api.themoviedb.org/3/movie/385687?api_key=0ccf59483fedbdb430d11f784efcd6a0
// let count = 0;
// searchBtn.addEventListener("click", (e) => {
//   if (count === 0) {
//     e.preventDefault();
//     searchMovies();
//   }
//   count++;
// });
searchInp.addEventListener("input", function (e) {
  if (searchInp.value === "") {
    window.location.href = "index.html";
  }
  searchMovies();
});

//implementing the movie genre.....
let genre = document.querySelectorAll(".genre");

let genreArr = [];
// console.log(genre)
async function getMovieGenre(genreName) {
  const res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=0ccf59483fedbdb430d11f784efcd6a0"
  );
  const data = await res.json();

  data.genres.forEach((ele) => {
    //console.log(ele)
    if (ele.name.includes(genreName)) {
      //console.log(ele.id);
      movieData(nowPlaying_url, ele.id, true);
    }
  });
}
getMovieGenre();

genre.forEach((ele) => {
  ele.addEventListener("click", function (e) {
    console.log(ele.textContent);
    getMovieGenre(ele.textContent);
  });
});

let btnSign = document.getElementById("btnSign");
btnSign.addEventListener("click", function () {
  //console.log('hi');
  window.location.href = "LogIn.html";
});
// console.log(isFlag);

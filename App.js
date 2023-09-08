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

const API = "api_key=0ccf59483fedbdb430d11f784efcd6a0";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const baseUrl1 = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/w500";
const nowPlaying_url =
  "https://api.themoviedb.org/3/movie/now_playing?api_key=0ccf59483fedbdb430d11f784efcd6a0";

const movieDetailsUrl =
  "https://api.themoviedb.org/3/movie/385687?api_key=0ccf59483fedbdb430d11f784efcd6a0";

let listOfMovies = document.querySelector(".rows");

/*.... fetching the data from the api...*/

let countofFlag = 0;
function loadingMovie(data, id = 0, isFlag = false) {
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
      data.results.forEach((res) => {
        let idgen = [];
        idgen = res.genre_ids.slice(0, 1);
        if (idgen.includes(id)) {
          // console.log(res.id, res.original_title);
          loadingMovie(data, res.id, true);
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

/*......implementing changing the rating color.......*/

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

/*....Implementing the movie details.....*/

let arr = [];
let newArray = [];
let heading = document.querySelector(".hdng");

function pushMovieDetails(data, isFlag = false) {
  if (isFlag) {
    if (!newArray.includes(data.id)) {
      newArray.push({
        id: data.id,
        duration: data.runtime,
        genre: data.genres[0].name,
        overview: data.overview,
        title: data.original_title,
        language: data.original_language,
        rating: data.vote_average,
        poster: data.poster_path,
      });
    }
  } else {
    if (!arr.includes(data.id)) {
      arr.push({
        id: data.id,
        duration: data.runtime,
        genre: data.genres[0].name,
        overview: data.overview,
        title: data.original_title,
        language: data.original_language,
        rating: data.vote_average,
        poster: data.poster_path,
      });
    }
  }
}

async function movieDetail(idArr, isFlag = false) {
  newArray = [];
  for (let i = 0; i < idArr.length; i++) {
    try {
      var res = await fetch(`${baseUrl}${idArr[i]}?${API}`);
      var data = await res.json();

      if (isFlag) {
        pushMovieDetails(data, isFlag);
      } else {
        pushMovieDetails(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (isFlag) {
    if (newArray.length === 0) {
      listOfMovies.innerHTML = "";
      heading.textContent = "No results...";
    } else {
      heading.textContent = "Now Playing...";
    }
    // console.log(newArray);
    movieOverview(newArray, true);
  } else {
    movieOverview(arr);
  }
}

/*....implementing the movie description.....*/

let overview = document.querySelector(".overview-window");
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

/*..........implementing the search function........*/

function loadSearchMovie(selectedGenre) {
  listOfMovies.innerHTML = "";
  selectedGenre.forEach((res) => {
    const markUp = `
    <div class="movie">
    <img class="poster" src="${imgUrl}${res.poster}" alt="${res.title}"/>
    <h4 class="title">${res.title}</h4>
    <span class="lang">${res.language.toUpperCase()}</span>
    <span class="rating">&star; ${parseFloat(res.rating).toFixed(1)}</span>
  </div>
    `;

    listOfMovies.insertAdjacentHTML("beforeend", markUp);
  });

  changeRatingColor();
  const searchID = selectedGenre.map((el, ind) => el.id);
  movieDetail(searchID, true);
  movieOverview();
}

function searchMovies() {
  var selectedGenre = [];

  const searchTerm = searchInp.value;
  //console.log(searchTerm);
  if (searchTerm === "") {
    return;
  }
  selectedGenre = arr.filter((ele) => {
    if (ele.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return ele.id;
    }
  });
  loadSearchMovie(selectedGenre);
}

searchInp.addEventListener("input", function (e) {
  if (searchInp.value === "") {
    window.location.href = "index.html";
  }
  e.preventDefault();
  searchMovies();
});

/*......implementing the movie genre.....*/

let genre = document.querySelectorAll(".genre");

async function getMovieGenre(genreName) {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=0ccf59483fedbdb430d11f784efcd6a0"
    );
    const data = await res.json();

    data.genres.forEach((ele) => {
      if (ele.name.includes(genreName)) {
        //console.log(ele.id);
        movieData(nowPlaying_url, ele.id, true);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

genre.forEach((ele) => {
  ele.addEventListener("click", function (e) {
    // console.log(ele.textContent);
    getMovieGenre(ele.textContent);
  });
});

/*.......implementing the logIn functionality......... */

let btnSign = document.getElementById("btn");
let userInfo = document.getElementById("userInfo");

btnSign.addEventListener("click", function () {
  window.location.href = "LogIn.html";
});

var logInStatus = JSON.parse(localStorage.getItem("loginStatus"));

const LogOutbtn = `<button  id="logoutbtn" type="submit">Log out</button>`;

let navDiv = document.getElementById("navDiv");

if (logInStatus[0] === "success") {
  btnSign.remove();

  userInfo.textContent = `Welcome ${logInStatus[2]
    .charAt(0)
    .toUpperCase()}${logInStatus[2].slice(1)}`;
  navDiv.insertAdjacentHTML("beforeend", LogOutbtn);
}

let btnLogOut = document.getElementById("logoutbtn");
btnLogOut.addEventListener("click", (e) => {
  userInfo.classList.add("hidden");
  localStorage.removeItem("loginStatus");
  window.location.href = "index.html";
});

/*.... implementing the movie model window....*/

function movieOverview(isFlag = false) {
  let movielist = document.querySelectorAll(".movie");
  if (logInStatus === null) {
    movielist.forEach((list) => {
      list.addEventListener("click", (e) => {
        alert(
          "Welcome! Please Login/Signup to access your account and continue using our application."
        );
      });
    });
  } else {
    movielist.forEach((list, ind) => {
      list.addEventListener("click", function (e) {
        let price = Math.trunc(Math.random() * (300 - 250 + 1)) + 250;
        let poster = list.querySelector(".poster");
        let title = list.querySelector(".title");
        //console.log(title.textContent);
        let lang = list.querySelector(".lang");
        let rating = list.querySelector(".rating");
        // console.log();
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
        let btnBook = document.querySelector("#bookTicketbtn");

        /*...proceeding to the checkout page...*/

        btnBook.addEventListener("click", () => {
          parentDiv.classList.add("hidden");
          overview.classList.add("hidden");
          offerBar.classList.add("hidden");
          searchInp.classList.add("hidden");
          let convFee = parseFloat(((price * 1.75) / 100).toFixed(2));

          const payment = `
       <div id="paymentSection" class="">
          <button type="submit" id="btnBack">Back</button>
          <div id="container">
          <div id="form1">
            <h1>Billing Details</h1>
            <h2 style="color: #009B77">${title.textContent}</h2>
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
              <form id="payment-form" action="" method="get">
                  <label for="card-number">Card Number:</label>
                  <input type="number" id="card-number" name="card-number" placeholder="Enter 16 digit card number" min="16" onKeyPress="if(this.value.length==16) return false" required>
  
                  <label for="expiration-date">Expiration Date:</label>
                  <input type="date" id="expiration-date" name="expiration-date" required>
  
                  <label for="cvv">CVV:</label>
                  <input type="number" id="cvv" name="cvv" placeholder="Enter 3 digit cvv number" min="3" onKeyPress="if(this.value.length==3) return false" required>
                  <h2>UPI</h2>
                  <label for="upi">Upi Id </label>
                  <input type="text" id="upi" name="upi" placeholder="Enter the Upi number">
  
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

          /*...implementing the tax...*/

          let ticketInput = document.getElementById("noOfTicket");
          let cnvFee = document.getElementById("feePrice");
          let totalamnt = document.getElementById("totalamnt");
          let perTicktPrice = document.getElementById("perTickt");
          totalamnt.textContent = `₹ ${price + Number(convFee)} `;
          cnvFee.textContent = "₹ " + convFee;

          function calculatingTheTax(notickt) {
            let taxCal = parseFloat((convFee * notickt).toFixed(2));
            let ticketPrice = price * notickt;
            perTicktPrice.textContent = "₹ " + ticketPrice;
            cnvFee.textContent = "₹ " + taxCal;
            totalamnt.textContent = `₹ ${ticketPrice + taxCal} `;
          }
          noOfTicket.addEventListener("input", function (e) {
            let notickt = parseInt(ticketInput.value);
            calculatingTheTax(notickt);

            if (noOfTicket.value === "" || noOfTicket.value == 0) {
              calculatingTheTax(1);
            }
          });

          /*.....Implementing the  back button functionality....*/

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
            // console.log("hi");
            if (
              (cardNumber.value !== "" &&
                cardNumber.value.length === 16 &&
                expDate.value !== "" &&
                cvv.value !== "" &&
                cvv.value.length === 3) ||
              upi.value !== ""
            ) {
              var minm = 100000;
              var maxm = 999999;
              thank_greet.textContent = `Booking Sucessfull ! Enjoy  your movie with Booking Id : BK${
                Math.floor(Math.random() * (maxm - minm + 1)) + minm
              }`;
              thank_greet.style.opacity = 1;
              alert(
                `Booking Successfull! Scroll down to check your booking id!`
              );

              setTimeout(() => {
                window.location.href = "index.html";
              }, 9000);
            } else {
              alert(`Please fill out the payment details!!`);
            }
          });
        });
      });
    });
  }
}
btnClose.addEventListener("click", function () {
  overview.classList.add("hidden");
});

//fetching the contianer & link section..
let signupForm = document.querySelector(".signInForm");
let loginForm = document.querySelector(".logInForm");
let signup_btnlnk = document.querySelector(".signUp");
let login_btnlnk = document.querySelector(".login");

//fetching the input section from signup form
let fname = document.querySelector(".frstName");
let email = document.querySelector(".email");
let pass = document.querySelector(".passwrd");
let phone = document.querySelector(".phoneNum");
let btn_signup = document.querySelector(".btn_signup");

//fetching the input from the login form..
let username = document.querySelector(".username");
let loginpass = document.querySelector(".password");
let btn_login = document.querySelector(".btn_login");
let p = document.createElement("p");
//link click facility...
signup_btnlnk.addEventListener("click", function () {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
  username.value = "";
  loginpass.value = "";
});
login_btnlnk.addEventListener("click", function () {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  fname.value = "";
  email.value = "";
  pass.value = "";
  phone.value = "";
  p.textContent = "";
});

let arr = JSON.parse(localStorage.getItem("users"));
if (arr == null) {
  arr = [];
}
btn_signup.addEventListener("click", function () {
  if (
    fname.value !== "" &&
    email.value !== "" &&
    pass.value !== "" &&
    phone.value !== ""
  ) {
    var details = {
      fstname: fname.value,
      email: email.value,
      paswrd: pass.value,
      phone: phone.value,
    };
    arr.push(details);
  }

  //console.log(details);

  localStorage.setItem("users", JSON.stringify(arr));

  // let p = document.createElement("p");
  if (
    fname.value !== "" &&
    email.value !== "" &&
    pass.value !== "" &&
    phone.value !== ""
  ) {
    p.textContent = "✅Account creation successfull !";
    signupForm.append(p);
  } else {
    alert("Please fill out all the fields!");
  }
});

// let p = document.createElement("p");
const displayMessage = function (message) {
  p.textContent = message;
  loginForm.append(p);
};
let isvalid = false;

let check = JSON.parse(localStorage.getItem("loginStatus"));
if (check == null) {
  check = [];
}
let status;

btn_login.addEventListener("click", function () {
  if (arr.length === 0 || (username.value === "" && loginpass.value === "")) {
    alert(`Username & password field can't be empty!
    `);
    btn_login.removeEventListener();
  }
  for (let i = 0; i < arr.length; i++) {
    if (
      (username.value === arr[i].email || username.value === arr[i].phone) &&
      loginpass.value === arr[i].paswrd
    ) {
      isvalid = true;
      check = [];
      status = "success";
      check.push(status, true, arr[i].fstname);
      localStorage.setItem("loginStatus", JSON.stringify(check));
      displayMessage(`Welcome back, ${arr[i].fstname}!`);
      setTimeout(() => {
        window.location.assign("index.html");
      }, 4000);
    }
  }
  if (!isvalid) {
    displayMessage("❌ Invalid username or password");
    check = [];
    status = "unsuccess";
    localStorage.removeItem("loginStatus", JSON.stringify(check));
    check.push(status, false);
    localStorage.setItem("loginStatus", JSON.stringify(check));
  }
});

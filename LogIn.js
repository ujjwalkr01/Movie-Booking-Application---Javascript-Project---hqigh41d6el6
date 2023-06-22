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

//link click facility...
signup_btnlnk.addEventListener("click", function () {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
});
login_btnlnk.addEventListener("click", function () {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

let arr = JSON.parse(localStorage.getItem("users"));
if (arr == null) {
  arr = [];
}
btn_signup.addEventListener("click", function () {
  const details = {
    fstname: fname.value,
    email: email.value,
    paswrd: pass.value,
    phone: phone.value,
  };
  //console.log(details);
  arr.push(details);
  localStorage.setItem("users", JSON.stringify(arr));

  let p = document.createElement("p");
  if (details.fstname !== "") {
    p.textContent = "✅Account created successfull !";
    signupForm.append(p);
    console.log(this.fstname);
    setTimeout(()=>{
      window.location.assign("index.html");
    },3000);
  }
});

let p = document.createElement("p");
const displayMessage = function (message) {
  p.textContent = message;
  loginForm.append(p);
};
let isvalid = false;
let isFlag=false;
btn_login.addEventListener("click", function () {
  for (let i = 0; i < arr.length; i++) {
    if (
      (username.value === arr[i].email || username.value === arr[i].phone) &&
      loginpass.value === arr[i].paswrd
    ) {
      isvalid = true;
      displayMessage(`Welcome back, ${arr[i].fstname}!`);
      setTimeout(() => {
         isFlag=true;
         console.log(isFlag);
        window.location.assign("index.html");
      }, 5000);
    }
  }
  if (!isvalid) {
    displayMessage("❌ Invalid username or password");
  }
});
// console.log(isFlag)
//export {isFlag};

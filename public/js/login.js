// Login page validation

const loginForm = document.getElementById("loginForm");

function passwordValidator(password) {
  if (!password) {
    return `No password provided`;
  }
  console.log(`Password: ${password}`);
  password = password.trim();
  if (password === "") {
    return `Password cannot contain be an empty string`;
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.match(/\ /g)) {
    return "Password cannot contain spaces.";
  }
  let uppercaseRegex = /[A-Z]+/g;
  let numberRegex = /[0-9]+/g;
  let symbolRegex = /[~`!@#\$%^&*()_+\-=[\]{}|\\;:'",<.>\/?]+/g;
  if (!password.match(uppercaseRegex)) {
    return "Password must have at least 1 UPPERCASE character";
  }
  if (!password.match(numberRegex)) {
    return "Password must have at least 1 NUMBER";
  }
  if (!password.match(symbolRegex)) {
    return "Password must have at least 1 SPECIAL character";
  }
  return false;
}

function userNameValidator(userName) {
  if (!userName) {
    return `Username cannot be null/empty`;
  }
  if (typeof userName != "string") {
    return `Username must be a string`;
  }
  userName = userName.trim();
  if (userName === "") {
    return `Username cannot be null/empty`;
  }

  return false;
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    const userNameInput = document.getElementById("userNameInput");
    const passwordInput = document.getElementById("passwordInput");
    const errorList = document.getElementById("errorList");
    console.log("Client JS loaded...");
    let errors = [];
    errorList.innerHTML = "";

    let userNameError = userNameValidator(userNameInput.value.trim());
    let passwordError = passwordValidator(passwordInput.value.trim());

    if (userNameError) errors.push(userNameError);
    if (passwordError) errors.push(passwordError);

    if (errors.length > 0) {
      console.log("Errors found!");
      for (let error of errors) {
        let errorElement = document.createElement("li");
        errorElement.innerHTML += error;
        errorList.appendChild(errorElement);
      }
      e.preventDefault();
    }
    errors = [];
  });
} else {
  console.log("I couldn't find the form");
}

// Login page validation

const registerForm = document.getElementById("registerForm");

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

function nameValidator(name, type) {
  if (!name) {
    return `${type} name cannot be null/empty`;
  }
  if (typeof name != "string") {
    return `${type} name must be a string`;
  }
  name = name.trim();
  if (name === "") {
    throw `${type} name cannot be null/empty`;
  }

  return false;
}

function emailValidator(email) {
  if (!email) {
    return `You have input an invalid email address`;
  }

  if (typeof email != "string") {
    return `Email address must be a valid string`;
  }

  email = email.toLowerCase().trim();

  if (email === "") {
    return `Email address contain be an empty string`;
  }

  let domRegex = /[^-[A-Za-z0-9]/g;
  let domRegexTwo = /((?<!\d+|\w+)-)|(-(?!\d+|\w+))/g;
  let preRegex = /[^A-Za-z0-9_.-]/g;
  let preRegexTwo = /[._-](?!\w+|\d+)/g;

  if (!email.includes("@") || !email.includes(".")) {
    return "Error: Invalid email.";
  }
  if (email.match(/@/g).length != 1) {
    return "Error: Invalid email.";
  }

  const [prefix, domain] = email.split("@");
  if (!prefix | !domain) {
    return "Error: Invalid email.";
  }
  const [domainName, com] = domain.split(".");
  if (prefix.length < 1 || domainName.length < 1) {
    return "Error: Invalid email.";
  }

  let invalidChars = prefix.match(preRegex);
  if (invalidChars != null) {
    return "Error: Invalid email.";
  }

  invalidChars = prefix.match(preRegexTwo);
  if (invalidChars != null) {
    return "Error: Invalid email.";
  }
  invalidChars = domainName.match(domRegex);
  if (invalidChars != null) {
    return "Error: Invalid email.";
  }
  invalidChars = domainName.match(domRegexTwo);
  if (invalidChars != null) {
    return "Error: Invalid email.";
  }
  if (com.length < 2) {
    return "Error: Invalid email.";
  }
  return false;
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const userNameInput = document.getElementById("userNameInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const confirmPasswordInput = document.getElementById(
      "confirmPasswordInput",
    );
    const errorList = document.getElementById("errorList");
    console.log("Client JS loaded...");
    let errors = [];
    errorList.innerHTML = "";

    let firstNameError = nameValidator(firstNameInput.value.trim(), "First");
    let lastNameError = nameValidator(lastNameInput.value.trim(), "Last");
    let userNameError = userNameValidator(userNameInput.value.trim());
    let emailError = emailValidator(emailInput.value.trim());
    let passwordError = passwordValidator(passwordInput.value.trim());
    let confirmPasswordError = passwordValidator(
      confirmPasswordInput.value.trim(),
    );

    if (firstNameError) errors.push(firstNameError);
    if (lastNameError) errors.push(lastNameError);
    if (userNameError) errors.push(userNameError);
    if (emailError) errors.push(emailError);
    if (passwordError) errors.push(passwordError);
    if (confirmPasswordError) errors.push(confirmPasswordError);
    if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
      errors.push("Passwords do not match");
    }

    console.log(errors);

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

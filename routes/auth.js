import userDataHelpers from "../data/user.js";
import helper from "../helpers.js";
import { Router } from "express";
import xss from "xss";

const router = Router();

router.route("/").get(async (req, res) => {
  return res.json({
    error: "YOU SHOULD NOT BE IN THIS ROUTE DUE TO MIDDLEWARE #1",
  });
});

router
  .route("/register")
  .get(async (req, res) => {
    return res.status(200).render("register", { title: "Register" });
  })
  .post(async (req, res) => {
    let validatedInput = undefined;
    let {
      firstNameInput,
      lastNameInput,
      userNameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
    } = req.body;

    firstNameInput = xss(firstNameInput);
    lastNameInput = xss(lastNameInput);
    userNameInput = xss(userNameInput);
    emailInput = xss(emailInput);
    passwordInput = xss(passwordInput);
    confirmPasswordInput = xss(confirmPasswordInput);

    try {
      validatedInput = helper.registerUserValidator(
        firstNameInput,
        lastNameInput,
        userNameInput.toLowerCase(),
        emailInput.toLowerCase(),
        passwordInput,
        confirmPasswordInput,
      );
    } catch (e) {
      return res
        .status(400)
        .render("register", { title: "Register", error: e });
    }

    let resDB = null;

    try {
      resDB = await userDataHelpers.createUser(
        validatedInput.firstName,
        validatedInput.lastName,
        validatedInput.userName,
        validatedInput.emailAddress,
        validatedInput.password,
        "",
        null,
      );
    } catch (e) {
      const status = 400;

      console.log(e);

      if (e === "Internal Server Error") status = 500;

      return res
        .status(status)
        .render("register", { title: "Register", error: e });
    }

    if (resDB.insertedUser) return res.redirect("/login");

    return res.render("register", { title: "Register", error: e });
  });

router
  .route("/login")
  .get(async (req, res) => {
    return res.status(200).render("login", { title: "Login" });
  })
  .post(async (req, res) => {
    let validatedInput = undefined;
    let errors = [];
    let { userNameInput, passwordInput } = req.body;
    userNameInput = xss(userNameInput);
    passwordInput = xss(passwordInput);

    try {
      validatedInput = helper.loginUserValidator(
        userNameInput.toLowerCase(),
        passwordInput,
      );
    } catch (e) {
      errors.push(e);
    }

    let resDB = null;

    try {
      resDB = await userDataHelpers.loginUser(
        validatedInput.userName,
        validatedInput.password,
      );
    } catch (e) {
      errors.push(e);
    }

    if (errors.length > 0) {
      return res.status(400).render("login", {
        title: "Login",
        errors: errors,
        errorFlag: true,
      });
    }
    req.session.user = resDB;

    return res.redirect("/home");
  });

router.route("/logout").get(async (req, res) => {
  const anHourAgo = new Date();

  anHourAgo.setHours(anHourAgo.getHours() - 1);

  res.cookie("AuthState", "", { expires: anHourAgo });
  res.clearCookie("AuthState");

  req.session.destroy();

  return res.redirect("/login");
});

export default router;

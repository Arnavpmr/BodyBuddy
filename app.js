// This file should set up the express server as shown in the lecture code
import express from "express";
import session from "express-session";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import configMiddlewares from "./middlewares/index.js";
import * as hbhelpers from "./handlebarhelpers.js";
import { challengeObject } from "./data/index.js";
import Handlebars from "handlebars";

const app = express();

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthState",
    secret: "1a2ef844bc9ab3966227b26b4afcac2b50947fce836406",
    resave: false,
    saveUninitialized: false,
  }),
);

configMiddlewares(app);
Handlebars.registerHelper("dateToString", hbhelpers.dateToString);

// app.use(mw.rewriteUnsupportedBrowserMethods);

// app.use("/", mw.root);
// app.use("/login", mw.login);
// app.use("/register", mw.register);
// app.use("/home", mw.home);
// app.use("/logout", mw.logout);
// app.use("/workouts", mw.workouts);
// app.use("/challenges", mw.challenges);

configRoutes(app);

try {
  await challengeObject.initializeQueue();
} catch (e) {
  console.log(e);
}

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

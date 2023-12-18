// This file should set up the express server as shown in the lecture code
import express from "express";
import session from "express-session";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import * as mw from "./routes/middleware.js";
import * as hbhelpers from "./handlebarhelpers.js";

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

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

import Handlebars from "handlebars";
import * as hbhelpers from "./handlebarhelpers.js";

export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper("dateTo24HRFormat", hbhelpers.dateTo24HRFormat);
  Handlebars.registerHelper("incrementIndex", hbhelpers.incrementIndex);
  Handlebars.registerHelper(
    "greaterThanLeaderboardMax",
    hbhelpers.greaterThanLeaderboardMax,
  );
  Handlebars.registerHelper("stringEquals", hbhelpers.stringEquals);
};

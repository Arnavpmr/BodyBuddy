import Handlebars from "handlebars";

export const dateTo24HRFormat = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const formattedTime = hours + ":" + minutes + ":" + seconds;

  return new Handlebars.SafeString(formattedTime);
};

export const incrementIndex = (value) => {
  return parseInt(value) + 1;
};

export const greaterThanLeaderboardMax = (value) => {
  return parseInt(value) > 100;
};

export const stringEquals = (arg1, arg2) => {
  return arg1 === arg2;
};

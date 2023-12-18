export const dateToString = (date) => {
  return new Handlebars.SafeString(date.toISOString());
};

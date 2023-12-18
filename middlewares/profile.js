export const profile = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

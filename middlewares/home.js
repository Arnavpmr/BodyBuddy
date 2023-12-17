export const home = async (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

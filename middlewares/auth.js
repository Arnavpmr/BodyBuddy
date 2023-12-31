export const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

export const root = async (req, res, next) => {
  if (req.originalUrl !== "/") return next();

  if (!req.session.user) return res.redirect("/about");

  return res.redirect("/home");
};

export const login = async (req, res, next) => {
  if (!req.session.user) return next();

  return res.redirect("/home");
};

export const register = async (req, res, next) => {
  if (!req.session.user) return next();

  return res.redirect("/home");
};

export const logout = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

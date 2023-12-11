// If the user posts to the server with a property called _method, rewrite the request's method
export const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

// Authentication
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

export const home = async (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

export const challenges = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

export const exercises = (req, res, next) => {
  if (!req.session.user)
    return res.status(403).json({
      error: "Cannot perform this operation without being authenticated",
    });

  if (req.session.user.role === "user")
    return res.status(403).json({
      error: "A user cannot perform this operation",
    });

  next();
};

export const workouts = (req, res, next) => {
  if (!req.session.user) {
    if (req.method === "GET") return res.redirect("/login");

    return res.status(403).json({
      error: "Cannot perform this operation without being authenticated",
    });
  }

  const { isPreset } = req.body;

  if (
    isPreset &&
    ["POST", "PUT", "DELETE"].includes(req.method) &&
    req.session.user.role === "user"
  )
    return res.status(403).json({
      error: "A user cannot perform this operation",
    });

  next();
};

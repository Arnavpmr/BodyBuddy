export const workouts = (req, res, next) => {
  if (req.session.user) return next();

  if (req.method === "GET") return res.redirect("/login");

  next();
};

export const workout = (req, res, next) => {
  const { isPreset } = req.body;

  next();
};

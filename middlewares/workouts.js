export const workouts = (req, res, next) => {
  if (req.session.user) return next();

  if (req.method === "GET") return res.redirect("/login");

  next();
};

export const workout = (req, res, next) => {
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

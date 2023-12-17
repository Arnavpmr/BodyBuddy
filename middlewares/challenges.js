export const challenges = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

export const submission = (req, res, next) => {
  if (req.session.user.role !== "user")
    return res.status(403).json({
      error: "An admin or owner cannot perform this operation",
    });

  next();
};

export const challenge = (req, res, next) => {
  if (!["admin", "owner"].includes(req.session.user.role))
    return res.status(403).json({
      error: "A user cannot perform this operation",
    });

  next();
};

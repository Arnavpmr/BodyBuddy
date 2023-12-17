export const exercises = (req, res, next) => {
  if (!req.session.user)
    return res.status(403).json({
      error:
        "Cannot perform this operation without being authenticated as an admin",
    });

  if (req.session.user.role === "user")
    return res.status(403).json({
      error: "A user cannot perform this operation",
    });

  next();
};

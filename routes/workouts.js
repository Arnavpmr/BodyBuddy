import { users } from "../config/mongoCollections.js";
import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  const userCollections = await users();
  const user = await userCollections.findOne({
    userName: req.session.user.userName,
  });

  if (!user)
    return res.status(200).render("error", {
      title: "Error",
      error: "User not found",
    });

  return res.status(200).render("workouts", {
    title: "Workouts",
    workouts: user.workouts,
  });
});

router
  .route("/workout")
  .get(async (req, res) => {})
  .post(async (req, res) => {});

router.route("/workout/:workoutId").get(async (req, res) => {});

export default router;

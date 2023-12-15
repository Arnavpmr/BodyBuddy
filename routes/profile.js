import { Router } from "express";

const router = Router();

router
  .route("/:userName")
  .get(async (req, res) => {
    return res.status(200).render("profile", {
      user: req.session.user,
    });
  })
  .put(async (req, res) => {});

router.route("/users").get();

export default router;

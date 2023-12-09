import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("about", {
    user: req.session.user,
  });
});

export default router;

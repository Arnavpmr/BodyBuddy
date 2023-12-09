import { Router } from "express";

const router = Router();

router.route("/:userName").get(async (req, res) => {
  return res.status(200).render("profile", {
    user: req.session.user,
  });
});

export default router;

import { Router } from "express";
import { xssSafe } from "../helpers.js";
const router = Router();

router.route("/").get(async (req, res) => {
  let user = xssSafe(req.session.user);
  return res.status(200).render("about", {
    user: user,
  });
});

export default router;

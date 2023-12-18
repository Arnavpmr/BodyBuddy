import { Router } from "express";
import xss from "xss";
const router = Router();

router.route("/").get(async (req, res) => {
  let userData = xss(req.session.user);
  return res.status(200).render("home", { title: "Home", userData: userData });
});

export default router;

import { Router } from "express";
import { xssSafe } from "../helpers.js";
import { userData } from "../data/index.js";
const router = Router();

router.route("/").get(async (req, res) => {
  let user = undefined;
  try {
    user = await userData.getUserByUsername(xssSafe(req.session.user.userName));
  } catch (e) {
    user = null;
  }
  return res.status(200).render("about", {
    title: "About",
    user: user,
  });
});

export default router;

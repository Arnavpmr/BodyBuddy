import { Router } from "express";
import xss from "xss";
const router = Router();

router.route("/").get(async (req, res) => {
  let user = xss(req.session.user);
  return res.status(200).render("about", {
    user: user,
  });
});

export default router;

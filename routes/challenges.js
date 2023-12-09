import usrFuncs from "../data/challenges.js";
import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  // const challenges = await usrFuncs.getAllChallenges();
  // const curDate = new Date();

  // const curChallenges = challenges.filter(
  //     (challenge) => challenge.deadline > curDate
  // );

  // const pastChallenges = challenges.filter(
  //     (challenge) => challenge.deadline < curDate
  // );

  return res.status(200).render("challenges", {
    // curChallenges: curChallenges,
    // pastChallenges: pastChallenges,
    user: req.session.user,
  });
});

export default router;

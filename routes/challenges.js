import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  //TODO: Implement fetching of data for current and past challenges by retrieving it from some mongo object
  const curChallenge = [];
  const pastChallenges = [];

  return res.status(200).render("challenges", {
    curChallenge: curChallenge,
    pastChallenges: pastChallenges,
    user: req.session.user,
  });
});

router.route("/challenge/submit").post(async (req, res) => {});

router.route("/challenge/submissions").get(async (req, res) => {});

router.route("/challenge/:submissionId").post(async (req, res) => {});

router.route("/challenge").post(async (req, res) => {});

router
  .route("/challenge/:challengeId")
  .put(async (req, res) => {})
  .delete(async (req, res) => {});

export default router;

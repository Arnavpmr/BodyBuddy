import { challengeQueue } from "../config/mongoCollections.js";
import { Router } from "express";

const router = Router();

router.route("/").get(async (req, res) => {
  const queueCollection = await challengeQueue();
  const challengesObject = await queueCollection.find({}).toArray()[0];

  return res.status(200).render("challenges", {
    curChallenge: challengesObject.current,
    pastChallenges: challengeQueue.pastChallenges,
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

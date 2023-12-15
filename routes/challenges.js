import { challengeQueue } from "../config/mongoCollections";
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

export default router;

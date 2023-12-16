import { challengeQueue } from "../config/mongoCollections.js";
import { challengeObject } from "../data/index.js";
import challenges from "../data/challenges.js";
import { Router } from "express";
import helper from "../helpers.js";

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

router.route("/current/update").post(async (req, res) => {
  const { status } = req.body;

  if (status !== "on" && status !== "off")
    return res.status(400).json({ error: "Status is invalid" });

  challengeObject.toggleUpdate(status);

  return res.status(200).json({ toggledUpdate: true });
});

router.route("/challenge/submit").post(async (req, res) => {
  // TODO validate all images
  // store the images in firebase and get all the urls and place them in the images field in new object
  // if everythings good, then check if user made a prev submission and remove that
  // set the status of new submission to review and push it to the db
});

router.route("/challenge/submissions").get(async (req, res) => {
  const queueCollection = await challengeQueue();
  const challengesObject = await queueCollection.find({}).toArray()[0];

  return res.status(200).json(challengesObject.submissions);
});

router.route("/challenge/:userName").post(async (req, res) => {
  const status = req.body;

  let userName = null;
  let resDB = null;

  try {
    if (status !== "approved" && status !== "denied") throw "Status is invalid";

    userName = helper.idValidator(req.params.userName);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    resDB = await challengeQueue.updateSubmission(userName, status);
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  return resDB;
});

router.route("/challenge").post(async (req, res) => {
  const { titleInput, descriptionInput, exercisesInput, rewardInput } =
    req.body;

  let newChallenge = null;
  let newChallengeDB = null;

  try {
    newChallenge = helper.challengeValidator(
      titleInput,
      descriptionInput,
      exercisesInput,
      rewardInput,
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  const { title, description, exercises, reward } = newChallenge;

  try {
    newChallengeDB = await challenges.createChallenge(
      exercises,
      title,
      reward,
      description,
    );
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  return res.status(200).json(newChallengeDB);
});

router
  .route("/challenge/:challengeId")
  .put(async (req, res) => {
    const { titleInput, descriptionInput, exercisesInput, rewardInput } =
      req.body;

    let challengeId = null;
    let newChallenge = null;
    let newChallengeDB = null;

    try {
      challengeId = helper.idValidator(req.params.challengeId);
      newChallenge = helper.challengeValidator(
        titleInput,
        descriptionInput,
        exercisesInput,
        rewardInput,
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    const { title, description, exercises, reward } = newChallenge;

    try {
      newChallengeDB = await challenges.updateChallenge(
        challengeId,
        exercises,
        title,
        reward,
        description,
      );
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(newChallengeDB);
  })
  .delete(async (req, res) => {
    let challengeId = null;
    let challengeDB = null;

    try {
      challengeId = helper.idValidator(req.params.challengeId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      challengeDB = await challenges.removeChallenge(challengeId);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(challengeDB);
  });

export default router;

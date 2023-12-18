import { challengeQueue } from "../config/mongoCollections.js";
import { challengeObject, challengeData, userData } from "../data/index.js";
import { Router } from "express";
import helper from "../helpers.js";
import multer from "multer";
import storageFirebase from "../firebase.js";
import { xssSafe } from "../helpers.js";
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    )
      return cb(null, true);
    else {
      const fileError = new Error("Only .png and .jpg files allowed");
      fileError.name = "fileExtensionError";

      return cb(fileError, false);
    }
  },
});

const router = Router();

router.route("/").get(async (req, res) => {
  const queueCollection = await challengeQueue();
  const challengesObject = (await queueCollection.find({}).toArray())[0];

  const curChallenge = await challengeData.getChallengeById(
    challengesObject.current,
  );
  const globalLeaderboard = challengesObject.leaderboard;
  const curUser = await userData.getUserByUsername(req.session.user.userName);

  return res.status(200).render("challenges", {
    curChallenge: challengesObject.current,
    pastChallenges: challengeQueue.pastChallenges,
    user: xssSafe(req.session.user),
  });
});

router.route("/challenge/toggleupdates").post(async (req, res) => {
  const { status } = xssSafe(req.body);

  if (status !== "on" && status !== "off")
    return res.status(400).json({ error: "Status is invalid" });

  challengeObject.toggleUpdate(status);

  return res.status(200).json({ toggledUpdate: true });
});

router.post(
  "/submit",
  upload.array("submissionInput", 10),
  async (req, res) => {
    try {
      const files = xssSafe(req.files);
      const links = await challengeData.uploadSubmissionImages(
        xssSafe(req.body.username),
        files,
      );

      return res.redirect("/challenges");
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
);

router.route("/challenge/submissions").get(async (req, res) => {
  const queueCollection = await challengeQueue();
  const challengesObject = await queueCollection.find({}).toArray();

  return res.status(200).json(challengesObject[0].submissions);
});

router
  .route("/challenge/submissions/submission/:userName")
  .get(async (req, res) => {
    let userName = null;
    let resDB = null;

    try {
      userName = helper.inputValidator(
        xssSafe(req.params.userName),
        "userName",
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      resDB = await challengeObject.getSubmissionByUserName(userName);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(resDB);
  })
  .post(async (req, res) => {
    const status = xssSafe(req.body);

    let userName = null;
    let resDB = null;

    try {
      if (status !== "approved" && status !== "denied")
        throw "Status is invalid";

      userName = helper.idValidator(xssSafe(req.params.userName));
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      resDB = await challengeObject.updateSubmissionByUser(userName, status);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return resDB;
  });

router.route("/challenge").post(async (req, res) => {
  let { titleInput, descriptionInput, exercisesInput, rewardInput } = req.body;

  titleInput = xssSafe(titleInput);
  descriptionInput = xssSafe(descriptionInput);
  exercisesInput = xssSafe(exercisesInput);
  rewardInput = xssSafe(rewardInput);

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
    newChallengeDB = await challengeData.createChallenge(
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
    let { titleInput, descriptionInput, exercisesInput, rewardInput } =
      req.body;

    titleInput = xssSafe(titleInput);
    descriptionInput = xssSafe(descriptionInput);
    exercisesInput = xssSafe(exercisesInput);
    rewardInput = xssSafe(rewardInput);

    let challengeId = null;
    let newChallenge = null;
    let newChallengeDB = null;

    try {
      challengeId = helper.idValidator(xssSafe(req.params.challengeId));
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
      newChallengeDB = await challengeData.updateChallenge(
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
      challengeId = helper.idValidator(xssSafe(req.params.challengeId));
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      challengeDB = await challengeData.removeChallenge(challengeId);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(challengeDB);
  });

export default router;

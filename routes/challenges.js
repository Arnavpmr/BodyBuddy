import { challengeQueue } from "../config/mongoCollections.js";
import { challengeObject } from "../data/index.js";
import challenges from "../data/challenges.js";
import { Router } from "express";
import helper from "../helpers.js";
import multer from "multer";
import storageFirebase from "../firebase.js";

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

  return res.status(200).render("challenges", {
    curChallenge: challengesObject.current,
    pastChallenges: challengeQueue.pastChallenges,
    user: req.session.user,
  });
});

router.route("/challenge/toggleupdates").post(async (req, res) => {
  const { status } = req.body;

  if (status !== "on" && status !== "off")
    return res.status(400).json({ error: "Status is invalid" });

  challengeObject.toggleUpdate(status);

  return res.status(200).json({ toggledUpdate: true });
});

router.post(
  "/challenge/submit",
  upload.array("user_submission", 10),
  async (req, res) => {
    // TODO store the images in firebase and get all the urls and place them in the images field in new object
    // if everythings good, then check if user made a prev submission and remove all those images from firebase
    // then check if user made a prev submission and remove it from mongo and prepare to replace it with the new submission
    // set the status of new submission to "pending" and push it to the db

    try {
      const files = req.files;
      const links = await challenges.uploadSubmissionImages(
        req.session.user.userName,
        files,
      );

      return res.status(200).json({ isUploaded: true });
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
      userName = helper.inputValidator(req.params.userName, "userName");
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
    const status = req.body;

    let userName = null;
    let resDB = null;

    try {
      if (status !== "approved" && status !== "denied")
        throw "Status is invalid";

      userName = helper.idValidator(req.params.userName);
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

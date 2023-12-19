import { challengeQueue } from "../config/mongoCollections.js";
import {
  challengeObject,
  challengeData,
  userData,
  exerciseData,
} from "../data/index.js";
import { Router } from "express";
import helper from "../helpers.js";
import multer from "multer";
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
  let queueCollection = undefined;
  let challengesObject = undefined;

  let curChallenge = undefined;
  let curUser = undefined;
  let curRank = undefined;
  let submission = undefined;

  let submissions = undefined;

  try {
    queueCollection = await challengeQueue();
    challengesObject = (await queueCollection.find({}).toArray())[0];
    curUser = await userData.getUserByUsername(
      xssSafe(req.session.user.userName),
    );

    try {
      submission = await challengeObject.getSubmissionByUserName(
        curUser.userName,
      );
      curRank = await challengeObject.getCurrentChallengeRankByUser(
        curUser.userName,
      );
    } catch (e) {
      submission = null;
    }

    curChallenge = await challengeData.getChallengeById(
      challengesObject.current,
    );
    curChallenge.exercises = await Promise.all(
      curChallenge.exercises.map(async (exercise) => {
        const fullExercise = await exerciseData.getExerciseById(exercise.id);
        return {
          exercise: fullExercise,
          sets: exercise.sets,
          reps: exercise.reps,
        };
      }),
    );
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  if (curUser.role === "admin") {
    try {
      submissions = challengesObject.submissions;
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  console.log(submissions);

  return res.status(200).render("challenges", {
    title: "Challenges",
    user: curUser,
    submission: submission,
    submissions: submissions,
    currentChallenge: curChallenge,
    curRank: curRank,
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
      const files = req.files;
      const links = await challengeData.uploadSubmissionImages(
        xssSafe(req.session.user.userName),
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

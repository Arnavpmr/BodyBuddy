import { Router } from "express";
import helper from "../helpers.js";
import exercises from "../data/exercises.js";
import { xssSafe } from "../helpers.js";
const router = Router();

router.route("/").post(async (req, res) => {
  let {
    exerciseNameInput,
    targetMusclesInput,
    exerciseDescriptionInput,
    instructionsInput,
    equipmentInput,
    difficultyInput,
    imageInput,
  } = req.body;

  exerciseNameInput = xssSafe(exerciseNameInput);
  targetMusclesInput = xssSafe(targetMusclesInput);
  exerciseDescriptionInput = xssSafe(exerciseDescriptionInput);
  instructionsInput = xssSafe(instructionsInput);
  equipmentInput = xssSafe(equipmentInput);
  difficultyInput = xssSafe(difficultyInput);
  imageInput = xssSafe(imageInput);

  let newExercise = null;
  let newExerciseDB = null;

  try {
    newExercise = helper.exerciseValidator(
      exerciseNameInput,
      targetMusclesInput,
      exerciseDescriptionInput,
      instructionsInput,
      equipmentInput,
      difficultyInput,
      imageInput,
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  const {
    name,
    targetMuscles,
    description,
    instructions,
    equipment,
    difficulty,
    image,
  } = newExercise;

  try {
    newExerciseDB = await exercises.createExercise(
      name,
      targetMuscles,
      description,
      instructions,
      equipment,
      difficulty,
      image,
    );
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  return res.status(200).json(newExerciseDB);
});

router
  .route("/:exerciseId")
  .put(async (req, res) => {
    let {
      exerciseNameInput,
      targetMusclesInput,
      exerciseDescriptionInput,
      instructionsInput,
      equipmentInput,
      difficultyInput,
      imageInput,
    } = req.body;

    exerciseNameInput = xssSafe(exerciseNameInput);
    targetMusclesInput = xssSafe(targetMusclesInput);
    exerciseDescriptionInput = xssSafe(exerciseDescriptionInput);
    instructionsInput = xssSafe(instructionsInput);
    equipmentInput = xssSafe(equipmentInput);
    difficultyInput = xssSafe(difficultyInput);
    imageInput = xssSafe(imageInput);

    let newExercise = null;
    let newExerciseDB = null;
    let exerciseId = null;

    try {
      newExercise = helper.exerciseValidator(
        exerciseNameInput,
        targetMusclesInput,
        exerciseDescriptionInput,
        instructionsInput,
        equipmentInput,
        difficultyInput,
        imageInput,
      );
      exerciseId = helper.idValidator(xssSafe(req.params.exerciseId));
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    const {
      name,
      targetMuscles,
      description,
      instructions,
      equipment,
      difficulty,
      image,
    } = newExercise;

    try {
      newExerciseDB = await exercises.updateExercise(
        exerciseId,
        name,
        targetMuscles,
        description,
        instructions,
        equipment,
        difficulty,
        image,
      );
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(newExerciseDB);
  })
  .delete(async (req, res) => {
    let exerciseId = null;
    let exercise = null;

    try {
      exerciseId = helper.idValidator(xssSafe(req.params.exerciseId));
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    exerciseId = xssSafe(exerciseId);

    try {
      exercise = await exercises.removeExercise(exerciseId);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(exercise);
  });

router.route("/target/:muscle_target").get(async (req, res) => {
  const muscleTarget = xssSafe(req.params.muscle_target);
  try {
    const exerciseLst = await exercises.getAllExercisesByTarget(muscleTarget);
    res.json({ match: exerciseLst });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

export default router;

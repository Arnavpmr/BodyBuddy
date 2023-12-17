import { Router } from "express";
import helper from "../helpers.js";
import exercises from "../data/exercises.js";

const router = Router();

router.route("/").post(async (req, res) => {
  const {
    exerciseNameInput,
    targetMusclesInput,
    exerciseDescriptionInput,
    instructionsInput,
    equipmentInput,
    difficultyInput,
    imageInput,
  } = req.body;

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
    const {
      exerciseNameInput,
      targetMusclesInput,
      exerciseDescriptionInput,
      instructionsInput,
      equipmentInput,
      difficultyInput,
      imageInput,
    } = req.body;

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
      exerciseId = helper.idValidator(req.params.exerciseId);
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
      exerciseId = helper.idValidator(req.params.exerciseId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      exercise = await exercises.removeExercise(exerciseId);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(exercise);
  });

router.route("/target/:muscle_target").get(async (req, res) => {
  try {
    const exerciseLst = await exercises.getAllExercisesByTarget(
      req.params.muscle_target,
    );
    res.json({ match: exerciseLst });
  } catch (error) {
    console.log(error.toString());
    res.status(500).json({ error: error.toString() });
  }
});

export default router;

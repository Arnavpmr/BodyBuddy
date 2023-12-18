import { Router } from "express";

import workouts from "../data/workouts.js";
import users from "../data/user.js";
import helper from "../helpers.js";
import { xssSafe } from "../helpers.js";
const router = Router();

router.route("/").get(async (req, res) => {
  const userWorkouts = await users.getUserWorkouts(req.session.user.userName);
  const workoutList = (await workouts.getAllWorkouts()).map((el) => {
    return {
      ...el,
      _id: el._id.toString(),
      userCreated: !el.isPreset,
    };
  });
  const retLst = [];
  for (let i = 0; i < workoutList.length; i++) {
    const element = workoutList[i];
    if (element.isPreset || userWorkouts.includes(element._id)) {
      element["string"] = JSON.stringify(element);
      retLst.push(element);
    }
  }

  let user = xssSafe(req.session.user);
  return res.status(200).render("workouts", {
    title: "Workouts",
    userData: req.session.user,
    workouts: retLst,
    user: user,
  });
});

router.route("/workout").post(async (req, res) => {
  const username = xssSafe(req.session.user.userName);
  let {
    name,
    workoutTypes,
    notes,
    exercises,
    weightGoal,
    difficulty,
    restTime,
  } = req.body;
  name = xssSafe(name);
  workoutTypes = xssSafe(workoutTypes);
  notes = xssSafe(notes);
  exercises = xssSafe(exercises);
  weightGoal = xssSafe(weightGoal);
  difficulty = xssSafe(difficulty);
  restTime = xssSafe(restTime);
  const user = await users.getUserByUsername(username);
  const unitMeasure = user.unitMeasure;

  let newWorkout = null;
  let newWorkoutDB = null;

  try {
    newWorkout = helper.workoutValidator(
      name,
      workoutTypes,
      notes,
      exercises,
      unitMeasure,
      weightGoal,
      difficulty,
      restTime,
    );
  } catch (e) {
    console.log(e.toString());
    return res.status(400).json({ error: e });
  }

  const {
    newName,
    newWorkoutTypes,
    newNotes,
    newExercises,
    newWeightGoal,
    newDifficulty,
    newRestTime,
  } = newWorkout;

  try {
    newWorkoutDB = await workouts.createWorkout(
      newName,
      newWorkoutTypes,
      newNotes,
      newExercises,
      false,
      newWeightGoal,
      newDifficulty,
      newRestTime,
    );
    const added = await users.addWorkoutToUser(
      username,
      newWorkoutDB._id.toString(),
    );

    return res.status(200).json(newWorkoutDB);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router
  .route("/workout/:workoutId")
  .put(async (req, res) => {
    const {
      name,
      workoutTypes,
      notes,
      exercises,
      weightGoal,
      difficulty,
      restTime,
    } = req.body;

    name = xssSafe(name);
    workoutTypes = xssSafe(workoutTypes);
    notes = xssSafe(notes);
    exercises = xssSafe(exercises);
    weightGoal = xssSafe(weightGoal);
    difficulty = xssSafe(difficulty);
    restTime = xssSafe(restTime);
    const user = await users.getUserByUsername(username);
    const unitMeasure = user.unitMeasure;

    let workoutId = null;
    let newWorkout = null;
    let newWorkoutDB = null;

    try {
      workoutId = helper.idValidator(req.params.workoutId);
      newWorkout = helper.workoutValidator(
        name,
        workoutTypes,
        notes,
        exercises,
        unitMeasure,
        weightGoal,
        difficulty,
        restTime,
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    const {
      newName,
      newWorkoutTypes,
      newNotes,
      newExercises,
      newWeightGoal,
      newDifficulty,
      newRestTime,
    } = newWorkout;

    try {
      newWorkoutDB = await workouts.updateWorkout(
        workoutId,
        newName,
        newWorkoutTypes,
        newNotes,
        newExercises,
        newWeightGoal,
        newDifficulty,
        newRestTime,
      );

      return res.status(200).json(newWorkoutDB);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    let workoutId = null;
    let workout = null;
    const username = xssSafe(req.session.user.userName);

    try {
      workoutId = helper.idValidator(req.params.workoutId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    workoutId = xssSafe(workoutId);
    try {
      workout = await workouts.removeWorkout(workoutId, username);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(workout);
  });

export default router;

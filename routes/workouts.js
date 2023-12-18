import { Router } from "express";

import workouts from "../data/workouts.js";
import users from "../data/user.js";
import helper from "../helpers.js";

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
    if (element.isPreset || userWorkouts.includes(element._id))
      retLst.push(element);
  }

  return res.status(200).render("workouts", {
    title: "Workouts",
    userData: req.session.user,
    workouts: retLst,
  });
});

router.route("/workout").post(async (req, res) => {
  const username = req.session.user.userName;
  const { name, workoutTypes, notes, exercises } = req.body;
  let newWorkout = null;
  let newWorkoutDB = null;

  try {
    newWorkout = helper.workoutValidator(name, workoutTypes, notes, exercises);
  } catch (e) {
    console.log(e.toString());
    return res.status(400).json({ error: e });
  }

  const { newName, newWorkoutTypes, newNotes, newExercises } = newWorkout;

  try {
    newWorkoutDB = await workouts.createWorkout(
      newName,
      newWorkoutTypes,
      newNotes,
      newExercises,
      false,
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
    const { name, workoutTypes, notes, exercises } = req.body;

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
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    const { newName, newWorkoutTypes, newNotes, newExercises } = newWorkout;

    try {
      newWorkoutDB = await workouts.updateWorkout(
        workoutId,
        newName,
        newWorkoutTypes,
        newNotes,
        newExercises,
      );

      return res.status(200).json(newWorkoutDB);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    let workoutId = null;
    let workout = null;

    try {
      workoutId = helper.idValidator(req.params.workoutId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      workout = await workouts.removeWorkout(workoutId);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json(workout);
  });

export default router;

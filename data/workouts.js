import helper from "../helpers.js";
import { workouts, exercises, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userDataFunctions from "./user.js";

let workoutDataFunctions = {
  async createWorkout(
    name,
    workoutTypes,
    notes,
    exercises,
    isPreset,
    weightGoal,
    difficulty,
    restTime,
  ) {
    try {
      name = helper.inputValidator(name, "name");
    } catch (e) {
      throw `${e}`;
    }

    if (typeof isPreset != "boolean") {
      throw "isPreset must be a boolean";
    }
    //optional
    notes = notes.trim();
    if (typeof notes != "string") {
      throw "Notes must be a valid string";
    }

    if (!Array.isArray(workoutTypes)) {
      throw "WorkoutType must be an array.";
    }
    if (!Array.isArray(exercises)) {
      throw "Exercises must be an array.";
    }
    if (exercises.length < 1) {
      throw "There must be atleast one exercise selected";
    }
    let newWorkout = {
      name: name,
      type: workoutTypes,
      notes: notes,
      exercises: exercises,
      isPreset: isPreset,
      weightGoal: weightGoal,
      difficulty: difficulty,
      restTime: restTime,
    };

    const workoutCollections = await workouts();
    const entry = await workoutCollections.insertOne(newWorkout);
    if (!entry.acknowledged || !entry.insertedId) {
      throw "Unable to add workout";
    }
    const newWorkoutId = entry.insertedId.toString();
    const workout = await this.getWorkoutById(newWorkoutId.toString());
    return workout;
  },

  async getAllWorkouts() {
    const workoutCollections = await workouts();
    let allWorkouts = await workoutCollections.find({}).toArray();

    if (!allWorkouts) {
      throw "No workouts in database.";
    }
    return allWorkouts;
  },

  async getWorkoutsByType(workoutType) {
    workoutType = helper.inputValidator(workoutType, "Type");
    const workoutCollections = await workouts();
    const workoutList = await workoutCollections.find({
      type: { $elemMatch: workoutType },
    });
    if (!workoutList) {
      throw `No workouts of type '${workoutType}' exist.`;
    }
    return exercises.toArray();
  },

  async getWorkoutById(workoutId) {
    try {
      helper.idValidator(workoutId);
    } catch (e) {
      throw `${e}`;
    }
    const workoutCollections = await workouts();
    let workout = await workoutCollections.findOne({
      _id: new ObjectId(workoutId),
    });
    if (!workout) {
      throw `No workout with the ID of ${workoutId} exists`;
    }
    workout._id = workout._id.toString();
    return workout;
  },
  async pullExerciseFromWorkout(workoutId, exerciseId) {
    try {
      workoutId = helper.idValidator(workoutId, "WorkoutId");
    } catch (e) {
      throw `${e}`;
    }

    const workoutCollections = await workouts();
    const workoutAfterPull = await workoutCollections.findOneAndUpdate(
      { _id: new ObjectId(workoutId) },
      {
        $pull: { exercises: new ObjectId(exerciseId) },
      },
      { returnDocument: "after" },
    );
    return workoutAfterPull;
  },

  async removeWorkout(workoutId, username) {
    try {
      workoutId = helper.idValidator(workoutId);
      username = helper.inputValidator(username, "username");
    } catch (e) {
      throw `${workoutId} not valid`;
    }
    const workoutCollections = await workouts();
    let workoutRemoved = await workoutCollections.findOneAndDelete({
      _id: new ObjectId(workoutId),
    });
    if (!workoutRemoved) {
      throw "Workout does not exist.";
    }

    const user_info = await userDataFunctions.getUserByUsername(username);
    const userCollections = await users();
    let removedFromUser = await userCollections.findOneAndUpdate(
      { _id: new ObjectId(user_info._id.toString()) },
      { $pull: { workouts: workoutId } },
      { returnDocument: "after" },
    );
    if (!removedFromUser) throw "Workout could not be removed";
    let myObj = { name: workoutRemoved.name, deleted: true };
    return myObj;
  },

  async updateWorkout(
    workoutId,
    workoutName,
    workoutTypes,
    notes,
    exercises,
    isPreset,
    weightGoal,
    difficulty,
    restTime,
  ) {
    try {
      workoutName = helper.inputValidator(workoutName, "workoutName");
    } catch (e) {
      throw `${e}`;
    }

    if (typeof isPreset != "boolean") {
      throw "isPreset must be a boolean";
    }
    //optional
    notes = notes.trim();
    if (typeof notes != "string") {
      throw "Notes must be a valid string";
    }

    if (!Array.isArray(workoutTypes)) {
      throw "WorkoutType must be an array.";
    }
    if (!Array.isArray(exercises)) {
      throw "Exercises must be an array.";
    }
    if (exercises.length < 1) {
      throw "There must be atleast one exercise selected";
    }
    const workoutCollections = await workouts();
    let updatedWorkout = await workoutCollections.findOneAndUpdate(
      { _id: new ObjectId(workoutId) },
      {
        $set: {
          name: workoutName,
          workoutType: workoutTypes,
          notes: notes,
          exercises: exercises,
          isPreset: isPreset,
          weightGoal: weightGoal,
          difficulty: difficulty,
          restTime: restTime,
        },
      },
      { returnDocument: "after" },
    );
    return updatedWorkout;
  },
};

export default workoutDataFunctions;

import helper from "../helpers.js";
import { exercises } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exerciseDataFunctions = {
  async createExercise(
    exerciseName,
    targetMuscles,
    exerciseDescription,
    instructions,
    equipment,
    difficulty,
    image,
  ) {
    const newExercise = helper.exerciseValidator(
      exerciseName,
      targetMuscles,
      exerciseDescription,
      instructions,
      equipment,
      difficulty,
      image,
    );

    const exerciseCollections = await exercises();
    const entry = await exerciseCollections.insertOne(newExercise);

    if (!entry.acknowledged || !entry.insertedId) {
      throw "Unable to add event";
    }

    return { id: entry.insertedId, inserted: true };
  },

  async getExerciseById(exerciseId) {
    helper.idValidator(exerciseId);

    const exerciseCollections = await exercises();

    let exercise = await exerciseCollections.findOne({
      _id: new ObjectId(exerciseId),
    });

    if (!exercise) {
      throw `Exercise not found with id`;
    }

    exercise._id = exercise._id.toString();

    return exercise;
  },

  async getAllExercisesByTarget(muscle) {
    muscle = helper.inputValidator(muscle, "Muscle");

    const exerciseCollections = await exercises();
    const exerciseList = await exerciseCollections.find({
      targetMuscles: muscle,
    });

    if (!exerciseList) {
      throw `No exercises exists that target ${muscle}.`;
    }

    return exerciseList.toArray();
  },

  async removeExercise(exerciseId) {
    helper.idValidator(exerciseId);

    const exerciseCollections = await exercises();
    let exerciseRemoved = await exerciseCollections.findOneAndDelete({
      _id: new ObjectId(exerciseId),
    });

    if (!exerciseRemoved) {
      throw "Exercise does not exist.";
    }

    return { deleted: true };
  },

  async updateExercise(
    exerciseId,
    exerciseName,
    targetMuscles,
    exerciseDescription,
    instructions,
    equipment,
    difficulty,
    image,
  ) {
    helper.idValidator(exerciseId);

    const newExercise = helper.exerciseValidator(
      exerciseName,
      targetMuscles,
      exerciseDescription,
      instructions,
      equipment,
      difficulty,
      image,
    );

    const exerciseCollections = await exercises();

    const resDB = await exerciseCollections.updateOne(
      { _id: new ObjectId(exerciseId) },
      {
        $set: {
          name: newExercise.exerciseName,
          targetMuscles: newExercise.targetMuscles,
          description: newExercise.exerciseDescription,
          instructions: newExercise.instructions,
          equipment: newExercise.equipment,
          difficulty: newExercise.difficulty,
          image: newExercise.image,
        },
      },
      { returnDocument: "after" },
    );

    if (resDB.nMatched === 0 || resDB.nModified === 0)
      throw `Exercise does not exist`;

    return { updated: true };
  },
};

export default exerciseDataFunctions;

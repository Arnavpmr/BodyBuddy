import helper from "../helpers.js";
import { exercises } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exerciseDataFunctions = {
  async createExercise(
    exerciseName,
    targetMuscle,
    exerciseDescription,
    instructions,
    sets,
    reps,
    equipment,
    difficulty,
    image,
  ) {
    try {
      exerciseName = helper.inputValidator(exerciseName, "exerciseName");
      exerciseDescription = helper.inputValidator(
        exerciseDescription,
        "exerciseDescription",
      );
      instructions = helper.inputValidator(instructions, "instructions");
      difficulty = helper.inputValidator(difficulty, "difficulty");
      image = helper.inputValidator(image, "image");
    } catch (e) {
      throw `${e}`;
    }

    if (!Array.isArray(targetMuscle)) {
      throw "TargetMuscle must be an array.";
    }
    if (!Array.isArray(equipment)) {
      throw "Equiment must be an array.";
    }
    if (isNaN(sets)) throw "Sets must be a number";
    if (isNaN(reps)) throw "Reps must be a number";
    let newExercise = {
      name: exerciseName,
      targetMuscles: targetMuscle,
      description: exerciseDescription,
      instructions: instructions,
      equipment: equipment,
      difficulty: difficulty,
      image: image,
    };

    const exerciseCollections = await exercises();
    const entry = await exerciseCollections.insertOne(newExercise);
    if (!entry.acknowledged || !entry.insertedId) {
      throw "Unable to add event";
    }
    return entry;
  },

  async getExerciseById(exerciseId) {
    try {
      helper.idValidator(exerciseId);
    } catch (e) {
      throw `id not valid`;
    }
    const exerciseCollections = await exercises();
    let exercise = await exerciseCollections.findOne({
      _id: new ObjectId(exerciseId),
    });
    if (!exercise) {
      throw `No exercise with the ID of ${exerciseId} exists`;
    }
    exercise._id = exercise._id.toString();
    return exercise;
  },

  async getAllExercisesByTarget(muscle) {
    try {
      muscle = helper.inputValidator(muscle, "Muscle");
    } catch (e) {
      throw `${e}`;
    }

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
    try {
      helper.idValidator(exerciseId);
    } catch (e) {
      throw `Id not valid.`;
    }
    const exerciseCollections = await exercises();
    let exerciseRemoved = await exerciseCollections.findOneAndDelete({
      _id: new ObjectId(exerciseId),
    });
    if (!exerciseRemoved) {
      throw "Exercise does not exist.";
    }
    let myObj = { exerciseName: exerciseRemoved.name, deleted: true };
    return myObj;
  },

  async updateExercise(
    exerciseId,
    exerciseName,
    targetMuscle,
    exerciseDescription,
    instructions,
    sets,
    reps,
    equipment,
    difficulty,
    image,
  ) {
    let exercise = null;
    const exerciseCollections = await exercises();
    try {
      helper.idValidator(exerciseId);
    } catch (e) {
      throw `Id not valid.`;
    }
    if (isNaN(sets)) throw "Sets must be a number";
    if (isNaN(reps)) throw "Reps must be a number";
    exercise = await exerciseCollections.findOne({
      _id: new ObjectId(exerciseId),
    });
    if (!exercise) {
      throw `Exercise does not exist.`;
    }

    exerciseName = helper.inputValidator(exerciseName, "exerciseName");
    exerciseDescription = helper.inputValidator(
      exerciseDescription,
      "exerciseDescription",
    );
    instructions = helper.inputValidator(instructions, "instructions");
    difficulty = helper.inputValidator(difficulty, "difficulty");

    if (!Array.isArray(targetMuscle)) {
      throw "TargetMuscle must be an array.";
    }
    if (!Array.isArray(equipment)) {
      throw "Equiment must be an array.";
    }

    let updatedExercise = await exerciseCollections.findOneAndUpdate(
      { _id: new ObjectId(exerciseId) },
      {
        $set: {
          name: exerciseName,
          targetMuscles: targetMuscle,
          description: exerciseDescription,
          instructions: instructions,
          equipment: equipment,
          difficulty: difficulty,
          image: image,
        },
      },
      { returnDocument: "after" },
    );
    return updatedExercise;
  },
};

export default exerciseDataFunctions;

import helper from "../helpers.js";
import { challenges } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let challengeDataFunctions = {
  async createChallenge(
    challengeExerciseList,
    challengeTitle,
    challengeReward,
    challengeDescription,
  ) {
    try {
      challengeTitle = helper.inputValidator;
      challengeDescription = helper.inputValidator;
    } catch (e) {
      throw `${e}`;
    }

    if (!Array.isArray(challengeExerciseList)) {
      throw "ExerciseList must be an array";
    }
    if (isNaN(challengeReward)) {
      throw "Reward must be a valid number";
    }
    if (challengeReward < 1) {
      throw "Reward cannot be negative.";
    }

    let newChallenge = {
      title: challengeTitle,
      description: challengeDescription,
      exercises: challengeExerciseList,
      reward: challengeReward,
    };

    const challengesCollections = await challenges();
    const entry = await challengesCollections.insertOne(newChallenge);
    if (!entry.acknowledged || !entry.insertedId) {
      throw "Unable to add challenge";
    }
    return entry;
  },

  async getAllChallenges() {
    const challengeCollections = await challenges();
    let getAllChallenges = await challengeCollections.find({}).toArray();
    if (!getAllChallenges) {
      throw "No challenges in database.";
    }
    return getAllChallenges;
  },

  async getChallengeById(challengeId) {
    try {
      helper.idValidator(challengeId, "challengeId");
    } catch (e) {
      throw `Id not valid.`;
    }

    const challengeCollections = await challenges();
    let challenge = challengeCollections.findOne({
      _id: new ObjectId(challengeId),
    });

    challenge._id = challenge.id.toString();
    return challenge;
  },

  async removeChallenge(challengeId) {
    try {
      helper.idValidator(challengeId, "challengeId");
    } catch (e) {
      throw `Id not valid.`;
    }
    const challengeCollections = await challenges();
    let challengeRemoved = await challengeCollections.findOneAndDelete({
      _id: new ObjectId(challengeId),
    });
    if (!challengeRemoved) {
      throw "Challenge does not exist.";
    }
    let myObj = { _id: challengeRemoved._id.toString(), deleted: true };
    return myObj;
  },

  async updateChallenge(
    challengeId,
    challengeExerciseList,
    challengeTitle,
    challengeReward,
    challengeDescription,
  ) {
    try {
      challengeTitle = helper.inputValidator;
      challengeDescription = helper.inputValidator;
    } catch (e) {
      throw `${e}`;
    }

    if (!Array.isArray(challengeExerciseList)) {
      throw "ExerciseList must be an array";
    }
    if (isNaN(challengeReward)) {
      throw "Reward must be a valid number";
    }
    if (challengeReward < 1) {
      throw "Reward cannot be negative.";
    }
    let challenge = await challengeCollections.find({
      _id: new ObjectId(challengeId),
    });
    if (!challenge) {
      throw `Challenge does not exist.`;
    }

    let updatedChallenge = await challengeCollections.findOneAndUpdate(
      { _id: new ObjectId(challengeId) },
      {
        $set: {
          title: challengeTitle,
          description: challengeDescription,
          exercises: challengeExerciseList,
          reward: challengeReward,
        },
      },
      { returnDocument: "after" },
    );
    return updatedChallenge;
  },
};

export default challengeDataFunctions;

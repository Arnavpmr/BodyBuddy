import helper from "../helpers.js";
import { challenges } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let challengeDataFunctions = {
  async createChallenge(exerciseList, timeLimit, reward, deadline) {
    deadline = deadline.trim();
    try {
      helper.dateValidator(deadline);
    } catch (e) {
      throw `${e}`;
    }

    if (!Array.isArray(exerciseList)) {
      throw "ExerciseList must be an array";
    }
    if (isNaN(reward)) {
      throw "Reward must be a valid number";
    }
    if (reward < 1) {
      throw "Reward cannot be negative.";
    }
    if (isNaN(timeLimit)) {
      throw "TimeLimit must be a valid number ";
    }
    if (timeLimit < 1) {
      throw "TimeLimit cannot be negative.";
    }

    let newChallenge = {
      exercises: exerciseList,
      timeLimit: timeLimit,
      reward: reward,
      deadline: deadline,
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
    exerciseList,
    timeLimit,
    reward,
    deadline,
  ) {
    let challenge = null;
    const challengeCollections = await challenges();
    try {
      helper.idValidator(challengeId);
    } catch (e) {
      throw `Id not valid.`;
    }
    challenge = await challengeCollections.find({
      _id: new ObjectId(challengeId),
    });
    if (!challenge) {
      throw `Challenge does not exist.`;
    }

    try {
      deadline = helper.inputValidator(deadline, "deadline");
    } catch (e) {
      throw `${e}`;
    }
    if (!Array.isArray(exerciseList)) {
      throw "ExerciseList must be an array";
    }
    if (isNaN(reward)) {
      throw "Reward must be a valid number";
    }
    if (isNaN(timeLimit)) {
      throw "TimeLimit must be a valid number ";
    }

    let updatedChallenge = await challengeCollections.findOneAndUpdate(
      { _id: new ObjectId(challengeId) },
      {
        $set: {
          exercises: exerciseList,
          timeLimit: timeLimit,
          reward: reward,
          deadline: deadline,
        },
      },
      { returnDocument: "after" },
    );
    return updatedChallenge;
  },
};

export default challengeDataFunctions;

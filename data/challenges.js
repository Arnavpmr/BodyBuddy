import helper from "../helpers.js";
import { challenges } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import storageFirebase from "../firebase.js";
import challengeObjectFunctions from "./challengeObject.js";

let challengeDataFunctions = {
  async createChallenge(exerciseList, title, reward, description) {
    title = helper.inputValidator(title, "title");
    description = helper.inputValidator(description, "description");

    if (!Array.isArray(exerciseList)) {
      throw "ExerciseList must be an array";
    }
    if (isNaN(reward)) {
      throw "Reward must be a valid number";
    }
    if (reward < 1) {
      throw "Reward cannot be negative.";
    }

    let newChallenge = {
      title: title,
      description: description,
      exercises: exerciseList,
      reward: reward,
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

  async getChallengeById(id) {
    id = helper.idValidator(id, "challengeId");

    const challengeCollections = await challenges();
    let challenge = challengeCollections.findOne({
      _id: new ObjectId(id),
    });

    challenge._id = challenge.id.toString();
    return challenge;
  },

  async removeChallenge(id) {
    id = helper.idValidator(id, "challengeId");

    const challengeCollections = await challenges();
    let challengeRemoved = await challengeCollections.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!challengeRemoved) {
      throw "Challenge does not exist.";
    }
    let myObj = { _id: challengeRemoved._id.toString(), deleted: true };
    return myObj;
  },

  async updateChallenge(id, exerciseList, title, reward, description) {
    title = helper.inputValidator;
    description = helper.inputValidator;

    if (!Array.isArray(exerciseList)) {
      throw "ExerciseList must be an array";
    }
    if (isNaN(reward)) {
      throw "Reward must be a valid number";
    }
    if (reward < 1) {
      throw "Reward cannot be negative.";
    }
    let challenge = await challengeCollections.find({
      _id: new ObjectId(id),
    });
    if (!challenge) {
      throw `Challenge does not exist.`;
    }

    let updatedChallenge = await challengeCollections.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title,
          description: description,
          exercises: exerciseList,
          reward: reward,
        },
      },
      { returnDocument: "after" },
    );
    return updatedChallenge;
  },

  async uploadSubmissionImages(userName, imageList) {
    userName = helper.inputValidator(userName);

    const bucket = storageFirebase.bucket();

    if (!Array.isArray(imageList)) throw "imageList must be an array";
    if (imageList.length === 0) throw "imageList must not be an empty list";

    let alreadySubmitted = false;
    let prevSubmission = {};

    await challengeObjectFunctions.removeSubmissionIfPresent(userName);

    const links = [];

    for (let i = 0; i < imageList.length; i++) {
      const element = imageList[i];
      const path = `challenges/${userName}/${element.originalname}`;

      links.push(await helper.uploadImageToFirebase(path, element.buffer));
    }

    const newSubmission = await challengeObjectFunctions.createSubmission(
      userName,
      links,
    );
    if (!newSubmission) throw "Submission failed";
    return links;
  },

  async createSubmission(userName, images) {},
};

// const t = storageFirebase.listAll();

export default challengeDataFunctions;

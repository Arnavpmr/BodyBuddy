import helper from "../helpers.js";
import { challenges, exercises } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { challengeObject } from "./index.js";
import storageFirebase from "../firebase.js";

let challengeDataFunctions = {
  async createChallenge(exerciseList, title, reward, description) {
    const newChallenge = helper.challengeValidator(
      title,
      description,
      exerciseList,
      reward,
    );

    const exerciseCollections = await exercises();
    const exercises = await exerciseCollections.find({});
    const exerciseIds = new Set(
      exercises.map((exercise) => exercise._id.toString()),
    );

    exerciseList.forEach((exercise) => {
      if (!exerciseIds.has(exercise.id)) throw "Exercise id is not valid";
    });

    const challengesCollections = await challenges();
    const entry = await challengesCollections.insertOne(newChallenge);

    if (!entry.acknowledged || !entry.insertedId) {
      throw "Unable to add challenge";
    }

    await challengeObject.pushChallenge(entry.insertedId);

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
    const queueCollection = await challengeQueue();
    const challengesObject = (await queueCollection.find({}).toArray())[0];

    if (!challengesObject.queue.includes(id))
      throw "Challenge must be in the queue in order to be removed";

    let challengeRemoved = await challengeCollections.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!challengeRemoved) {
      throw "Challenge does not exist.";
    }

    await challengeObject.removeChallengeFromQueue(id);

    let myObj = { deleted: true };

    return myObj;
  },

  async updateChallenge(id, exerciseList, title, reward, description) {
    const newChallenge = helper.challengeValidator(
      title,
      description,
      exerciseList,
      reward,
    );

    const exerciseCollections = await exercises();
    const exercises = await exerciseCollections.find({});
    const exerciseIds = new Set(
      exercises.map((exercise) => exercise._id.toString()),
    );

    exerciseList.forEach((exercise) => {
      if (!exerciseIds.has(exercise.id)) throw "Exercise id is not valid";
    });

    const challengeCollection = await challenges();
    const queueCollection = await challengeQueue();
    let challengesObject = (await queueCollection.find({}).toArray())[0];

    const challenge = await challengeCollection.find({
      _id: new ObjectId(id),
    });

    if (!challenge) throw `Challenge does not exist.`;

    if (!challengesObject.queue.includes(id))
      throw "Challenge must be in the queue in order to be updated";

    let updatedChallenge = await challengeCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: newChallenge.title,
          description: newChallenge.description,
          exercises: newChallenge.exerciseList,
          reward: newChallenge.reward,
        },
      },
      { returnDocument: "after" },
    );

    return updatedChallenge;
  },

  async uploadSubmissionToFirebase(userName, challengeId, imageList) {
    userId = helper.inputValidator(userName);
    challengeId = helper.idValidator(challengeId);

    const bucket = storageFirebase.bucket();

    ("challenges/challengeId/userId/(pictures)");

    if (!Array.isArray(imageList)) throw "imageList must be an array";

    if (imageList.length === 0) throw "imageList must not be an empty list";

    imageList.forEach((fileData) => {
      const name = fileData.originalname;

      const file = bucket.file(`${name}`, {
        uploadType: { resumeable: false },
      });

      file.save(fileData.buffer, (err) => {
        if (err) throw err;
      });
    });
  },
};

export default challengeDataFunctions;

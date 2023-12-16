import { challengeQueue } from "../config/mongoCollections.js";
import user from "../data/user.js";
import helper from "../helpers.js";

let challengeQueueFunctions = {
  async queueObject() {
    let current = undefined;
    let queue = [];
    let pastChallenges = [];
    let submissions = [];
    let staticObject = {
      current: current,
      queue: queue,
      pastChallenges: pastChallenges,
      submissions: submissions,
    };

    const queueCollection = await challengeQueue();
    const entry = await queueCollection.insertOne(staticObject);
    if (!entry.acknowledged || !entry.insertedId) {
      throw "Unable to add challenge";
    }
    return entry;
  },
  async pushChallenge(challengeID) {
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray();
    let pushToQueue = await queueCollection.findOneAndUpdate(
      { _id: challengesObject[0]._id },
      { $push: { queue: challengeID } },
      { returnDocument: "after" },
    );
    return challengesObject;
  },
  async popChallenge() {
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray()[0];
    challengesObject.queue.dequeue();
  },
  async updateCurrent() {
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray();

    let oldChallenge = await queueCollection.findOneAndUpdate(
      { _id: challengesObject[0]._id },
      {
        $push: { pastChallenges: challengesObject[0].current },
        $set: { current: challengesObject[0].queue[0] },
        $pop: { queue: -1 },
      },
      { returnDocument: "after" },
    );

    return { newCurrentChallenge: challengesObject.current };
  },
  async createSubmission(userName, images) {
    let userDB = null;

    try {
      userDB = await user.getUserByUsername(userName);

      if (!Array.isArray(images)) throw "Images is not valid";
    } catch (e) {
      throw e;
    }

    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray()[0];

    const curSubmission = {
      userName: userName,
      images: images,
      status: "review",
    };

    const newSubmissionDB = await queueCollection.findOneAndUpdate(
      {
        _id: challengesObject[0]._id,
      },
      { $push: { submissions: curSubmission } },
    );

    return newSubmissionDB;
  },
};

export default challengeQueueFunctions;

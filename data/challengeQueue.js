import { challengeQueue } from "../config/mongoCollections.js";
import helper from "../helpers.js";
import { ObjectId } from "mongodb";
// const schedule = require("node-schedule");

// const queue = new Queue();

let challengeQueueFunctions = {
  async queueObject() {
    let current = undefined;
    let queue = [];
    let pastChallenges = [];
    let staticObject = {
      current: current,
      queue: queue,
      pastChallenges: pastChallenges,
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
};

export default challengeQueueFunctions;

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

    let challengesObject = await queueCollection.findOneAndUpdate(
      { _id: new ObjectId("657b9f4a1dccfc052f6dc407") },
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
    console.log(challengesObject);
    let oldChallenge = await queueCollection.findOneAndUpdate(
      { _id: challengesObject._id },
      {
        $push: { pastChallenges: challengesObject.current },
        $set: { current: challengesObject.queue[0] },
        $pop: { queue: -1 },
      },
      { returnDocument: "after" },
    );
    // challengesObject["pastChallenges"].push(challengesObject.current);
    // if (challengesObject.isEmpty()) {
    //   challengesObject["current"] = "";
    // } else {
    //   challengesObject.current = challengeQueue.dequeue();
    // }

    return { newCurrentChallenge: challengesObject.current };
  },
};

export default challengeQueueFunctions;

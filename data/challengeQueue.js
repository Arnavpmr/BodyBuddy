import { challengeQueue } from "../config/mongoCollections.js";
import helper from "../helpers.js";
import { Queue } from "@datastructures-js/queue";
import { ObjectId } from "mongodb";
// const schedule = require("node-schedule");

// const queue = new Queue();

let challengeQueueFunctions = {
  async queueObject() {
    let queue = new Queue();
    let current = undefined;
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
    // try {
    //   challengeID = helper.idValidator(challengeID);
    // } catch (e) {
    //   throw `${e}`;
    // }
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray()[0];
    challengesObject.queue.enqueue(challengeID);
  },
  async popChallenge() {
    queue.dequeue();
  },
  async updateCurrent() {
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray()[0];
    // console.log(challengesObject[0])
    challengesObject["pastChallenges"].push(challengesObject.current);
    if (challengesObject.isEmpty()) {
      challengesObject["current"] = "";
    } else {
      challengesObject.current = challengeQueue.dequeue();
    }

    return { newCurrentChallenge: challengesObject.current };
  },
};

export default challengeQueueFunctions;

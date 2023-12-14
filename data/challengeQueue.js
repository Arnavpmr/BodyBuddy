import { challengeQueue } from "../config/mongoCollections";
import helper from "../helpers";
import { Queue } from "@datastructures-js/queue";
import { ObjectId } from "mongodb";
const schedule = require("node-schedule");

const queue = new Queue();
let challengeQueueFunctions = {
  async queueObject() {
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
    try {
      challengeID = helper.idValidator(challengeID);
    } catch (e) {
      throw `${e}`;
    }
    queue.enqueue(challengeID);
  },
  async popChallenge() {
    queue.dequeue();
  },
  async scheduler() {},
};

export default challengeQueueFunctions;

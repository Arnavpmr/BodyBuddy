import { challengeQueue } from "../config/mongoCollections.js";
import user from "./user.js";
import helper from "../helpers.js";

let challengeObjectFunctions = {
  job: {
    status: "off",
    process: null,
    interval: 10000,
  },

  async initializeQueue() {
    let current = null;
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
    const challengesObject = await queueCollection.find({}).toArray();

    if (challengesObject.length > 0) return;

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
    return pushToQueue;
  },

  async popChallenge() {
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray()[0];
    challengesObject.queue.dequeue();
  },

  async updateCurrent() {
    const queueCollection = await challengeQueue();
    let challengesObject = (await queueCollection.find({}).toArray())[0];

    if (challengesObject.queue.length === 0) return;

    if (challengesObject.current)
      challengesObject.pastChallenges.push(challengesObject.current);

    challengesObject.current = challengesObject.queue[0];
    challengesObject.queue.pop();

    let oldChallenge = await queueCollection.findOneAndUpdate(
      { _id: challengesObject._id },
      {
        $set: {
          pastChallenges: challengesObject.pastChallenges,
          current: challengesObject.current,
          queue: challengesObject.queue,
        },
      },
      { returnDocument: "after" },
    );

    return challengesObject.current;
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
        _id: challengesObject._id,
      },
      { $push: { submissions: curSubmission } },
      { returnDocument: "after" },
    );

    return newSubmissionDB;
  },

  async updateSubmissionByUser(userName, status) {
    try {
      userName = helper.inputValidator(userName, "userName");

      if (status !== "approved" && status !== "denied")
        throw "Status is not valid";
    } catch (e) {
      throw e;
    }

    const queueCollection = await challengeQueue();

    const updatedQueue = await queueCollection.updateOne(
      {
        "submissions.userName": userName,
      },
      {
        $set: { "submissions.$.status": status },
      },
    );

    return updatedQueue;
  },

  async getSubmissionByUserName(userName) {
    try {
      userName = helper.inputValidator(userName, "userName");
    } catch (e) {
      throw e;
    }

    const queueCollection = await challengeQueue();
    const challengesObject = (await queueCollection.find({}).toArray())[0];
    const submissions = challengesObject.submissions;

    const foundSubmission = submissions.find(
      (submission) => submission.userName === userName,
    );

    if (!foundSubmission) throw "Submission not found for user";

    return foundSubmission;
  },

  toggleUpdate(status) {
    if (status === this.job.status) return;

    if (status === "on")
      this.job.process = setInterval(async () => {
        await this.updateCurrent();
      }, this.job.interval);

    if (status === "off") clearInterval(this.job.process);

    this.job.status = status;
  },
};

export default challengeObjectFunctions;

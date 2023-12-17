import { challengeQueue } from "../config/mongoCollections.js";
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

  async pushChallenge(id) {
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray();
    let pushToQueue = await queueCollection.findOneAndUpdate(
      { _id: challengesObject[0]._id },
      { $push: { queue: id } },
      { returnDocument: "after" },
    );
    return pushToQueue;
  },

  async removeChallengeFromQueue(id) {
    const queueCollection = await challengeQueue();
    let challengesObject = await queueCollection.find({}).toArray()[0];

    const newQueue = challengesObject.queue.filter(
      (challengeId) => challengeId !== id,
    );

    if (newQueue.length === challengesObject.queue.length)
      throw "Challenge not found in queue";

    const resDB = await queueCollection.updateOne(
      { _id: challengesObject[0]._id },
      { $set: { queue: newQueue } },
      { returnDocument: "after" },
    );

    if (resDB.nModified === 0) throw "Challenge not found in queue";

    return resDB;
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
    if (!Array.isArray(images)) throw "Images is not valid";

    if (images.some((image) => image.trim() === ""))
      throw "Image url cannot be empty";

    const queueCollection = await challengeQueue();
    let challengesObject = (await queueCollection.find({}).toArray())[0];

    const curSubmission = {
      userName: userName,
      images: images,
      status: "pending",
    };

    await queueCollection.updateOne(
      {
        _id: challengesObject._id,
      },
      { $push: { submissions: curSubmission } },
      { returnDocument: "after" },
    );

    return { inserted: true };
  },

  async updateSubmissionByUser(userName, status) {
    userName = helper.inputValidator(userName, "userName");

    if (status !== "approved" && status !== "denied")
      throw "Status is not valid";

    const queueCollection = await challengeQueue();

    const resDB = await queueCollection.updateOne(
      {
        "submissions.userName": userName,
      },
      {
        $set: { "submissions.$.status": status },
      },
    );

    if (resDB.nModified === 0) throw "Submission not found for user";

    return resDB;
  },

  async getSubmissionByUserName(userName) {
    userName = helper.inputValidator(userName, "userName");

    const queueCollection = await challengeQueue();
    const challengesObject = (await queueCollection.find({}).toArray())[0];
    const submissions = challengesObject.submissions;

    const foundSubmission = submissions.find(
      (submission) => submission.userName === userName,
    );

    if (!foundSubmission) throw "Submission not found for user";

    return foundSubmission;
  },

  async removeSubmissionByUser(userName) {
    userName = helper.inputValidator(userName, "userName");

    const queueCollection = await challengeQueue();
    const challengesObject = (await queueCollection.find({}).toArray())[0];
    const submissions = challengesObject.submissions;

    const newSubmissions = submissions.filter(
      (submission) => submission.userName !== userName,
    );

    if (newSubmissions.length === submissions.length)
      throw "Submission not found for user";

    const updatedQueue = await queueCollection.updateOne(
      {
        _id: challengesObject._id,
      },
      {
        $set: { submissions: newSubmissions },
      },
    );

    return { deleted: true };
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

import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import helpers from "./helpers.js";
import { challengeQueue } from "./data/index.js";

// let myObj = await challengeQueue.queueObject();
// let pushChallenge = await challengeQueue.pushChallenge("objectID");
// let pushChallenge1 = await challengeQueue.pushChallenge("objectID1");
// let pushChallenge2 = await challengeQueue.pushChallenge("objectID2");
// let pushChallenge3 = await challengeQueue.pushChallenge("objectID3");
// let pushChallenge4 = await challengeQueue.pushChallenge("objectID4");

let update = await challengeQueue.updateCurrent();

await closeConnection();
console.log("\nDone!\n");

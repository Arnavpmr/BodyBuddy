import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import helpers from "./helpers.js";
import { challengeQueue } from "./data/index.js";
await dbConnection();
// let myObj = await challengeQueue.queueObject();
// let pushChallenge0 = await challengeQueue.pushChallenge("objectID0");
// let pushChallenge1 = await challengeQueue.pushChallenge("objectID1");
// let pushChallenge2 = await challengeQueue.pushChallenge("objectID2");
// let pushChallenge3 = await challengeQueue.pushChallenge("objectID3");
// let pushChallenge4 = await challengeQueue.pushChallenge("objectID7");

// let update = await challengeQueue.updateCurrent();
// let pop = await challengeQueue.popChallenge();
// let start =  challengeQueue.startScheduler();

await closeConnection();
console.log("\nDone!\n");

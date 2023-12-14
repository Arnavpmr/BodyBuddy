import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import helpers from "./helpers.js";
import { challengeQueue } from "./data/index.js";

let myObj = await challengeQueue.queueObject();
let pushChallenge = await challengeQueue.pushChallenge("objectID");

await closeConnection();
console.log("\nDone!\n");

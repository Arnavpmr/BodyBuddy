import { closeConnection } from "./config/mongoConnection.js";
import { challengeObject } from "./data/index.js";

let pushChallenge = await challengeObject.pushChallenge("objectID");
let pushChallenge1 = await challengeObject.pushChallenge("objectID1");
let pushChallenge2 = await challengeObject.pushChallenge("objectID2");
let pushChallenge3 = await challengeObject.pushChallenge("objectID3");
let pushChallenge4 = await challengeObject.pushChallenge("objectID4");

await closeConnection();
console.log("\nDone!\n");

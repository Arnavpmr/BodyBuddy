import { closeConnection } from "./config/mongoConnection.js";
import { challengeData } from "./data/index.js";

await challengeData.pushToCurrentLeaderboards("jsmith123");

await closeConnection();
console.log("\nDone!\n");

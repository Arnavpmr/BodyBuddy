import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const appFirebase = initializeApp({
  credential: cert("./secrets.json"),
  databaseURL: "https://bodybuddy-2bcc5.firebaseio.com",
  storageBucket: "bodybuddy-2bcc5.appspot.com",
});

const storageFirebase = getStorage(appFirebase);

export default storageFirebase;

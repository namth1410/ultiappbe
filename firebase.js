import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import config from "./config.js";

const firebase = initializeApp(config.firebaseConfig);

export const firestore = getFirestore(firebase);

export default firebase;

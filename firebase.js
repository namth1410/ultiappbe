import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import config from "./config.js";

const firebase = initializeApp(config.firebaseConfig);

export const firestore = getFirestore(firebase);
export const storage = getStorage(firebase);

export default firebase;

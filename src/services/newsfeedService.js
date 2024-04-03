import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { io } from "../../app.js";
import { firestore } from "../../firebase.js";

const snapshotNewsfeed = async (classId) => {
  try {
    const q = query(
      collection(firestore, "newsfeed"),
      where("class", "==", classId),
      orderBy("dateCreate", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      io.emit("reload", { getNewsfeedOfClass: classId });
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    throw new Error("Error fetching newsfeed");
  }
};

const getNewsfeedOfClass = async (classId) => {
  try {
    const q = query(
      collection(firestore, "newsfeed"),
      where("class", "==", classId),
      orderBy("dateCreate", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const newsfeed = [];

    querySnapshot.forEach((doc) => {
      newsfeed.push({ ...doc.data(), id: doc.id });
    });

    return newsfeed;
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    throw new Error("Error fetching newsfeed");
  }
};

export { getNewsfeedOfClass, snapshotNewsfeed };

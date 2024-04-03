import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { io } from "../../app.js";
import { firestore, storage } from "../../firebase.js";

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

const postNewsfeed = async (data) => {
  const { classId, imageNewFeed, currentUser, content } = data;
  try {
    let imageUrl = "";
    const uploadFile = async () => {
      const now = new Date().toISOString();
      const storageRef = ref(storage, `Newsfeed/${classId}/${now}`);

      await uploadBytes(storageRef, imageNewFeed.buffer)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          imageUrl = downloadURL;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    if (imageNewFeed) {
      await uploadFile();
    }

    const dataToAdd = {
      dateCreate: new Date().toISOString(),
      uidCreator: JSON.parse(currentUser).uid,
      nameCreator: JSON.parse(currentUser).displayName,
      photoURL: JSON.parse(currentUser).photoURL,
      class: classId,
      content: content,
      image: imageUrl,
    };
    console.log(dataToAdd);
    await addDoc(collection(firestore, "newsfeed"), dataToAdd);

    return { statusCode: 200, message: "OK" };
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    throw new Error("Error fetching newsfeed");
  }
};

const deleteNewsfeed = async (newsfeedId) => {
  try {
    await deleteDoc(doc(firestore, "newsfeed", newsfeedId));
    return { statusCode: 200, message: "OK" };
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    throw new Error("Error fetching newsfeed");
  }
};

const postCommentNewsfeed = async (newfeed) => {
  try {
    const quizzRef = doc(firestore, "newsfeed", newfeed.id);
    await updateDoc(quizzRef, newfeed);
    return { statusCode: 200, message: "OK" };
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    throw new Error("Error fetching newsfeed");
  }
};

export {
  deleteNewsfeed,
  getNewsfeedOfClass,
  postCommentNewsfeed,
  postNewsfeed,
  snapshotNewsfeed,
};

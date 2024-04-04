import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { io } from "../../app.js";
import { firestore } from "../../firebase.js";

const snapshotDataClass = async (classId) => {
  try {
    const classRef = doc(firestore, "classes", classId);

    const unsubscribe = onSnapshot(classRef, (docSnapshot) => {
      io.emit("reload", { dataClass: classId });
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error snapshotDataClass:", error);
    throw new Error("Error snapshotDataClass");
  }
};

const getUserCreatedClasses = async (uid) => {
  try {
    const classesRef = collection(firestore, "classes");
    const querySnapshot = await getDocs(
      query(
        classesRef,
        where("uidCreator", "==", uid),
        orderBy("dateCreate", "desc")
      )
    );

    if (querySnapshot.empty) {
      return null;
    } else {
      const userCreatedClasses = [];
      querySnapshot.forEach((doc) => {
        userCreatedClasses.push({ id: doc.id, ...doc.data() });
      });
      return userCreatedClasses;
    }
  } catch (error) {
    console.error("Error fetching user created classes:", error);
    throw new Error("Error fetching user created classes");
  }
};

const getUserJoinedClasses = async (uid) => {
  try {
    const classesRef = collection(firestore, "classes");
    const querySnapshot = await getDocs(
      query(
        classesRef,
        where("members", "array-contains", uid),
        orderBy("dateCreate", "desc")
      )
    );

    if (querySnapshot.empty) {
      return null;
    } else {
      const userJoinedClasses = [];
      querySnapshot.forEach((doc) => {
        userJoinedClasses.push({ id: doc.id, ...doc.data() });
      });
      return userJoinedClasses;
    }
  } catch (error) {
    console.error("Error fetching user joined classes:", error);
    throw new Error("Error fetching user joined classes");
  }
};

const getClassById = async (id) => {
  try {
    const classRef = doc(firestore, "classes", id);
    const docSnapshot = await getDoc(classRef);

    if (docSnapshot.exists()) {
      const classData = { id, ...docSnapshot.data() };
      return classData;
    } else {
      console.log("Class does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching class by id:", error);
    throw new Error("Error fetching class by id");
  }
};

const getHomeworkOfClass = async (id) => {
  try {
    const classesRef = collection(firestore, "homework");
    const querySnapshot = await getDocs(
      query(classesRef, where("class", "==", id))
    );

    if (querySnapshot.empty) {
      return null;
    } else {
      const homeworkData = [];
      querySnapshot.forEach((doc) => {
        homeworkData.push({ id: doc.id, ...doc.data() });
      });
      return homeworkData;
    }
  } catch (error) {
    console.error("Error fetching user joined classes:", error);
    throw new Error("Error fetching user joined classes");
  }
};

export {
  getClassById,
  getHomeworkOfClass,
  getUserCreatedClasses,
  getUserJoinedClasses,
  snapshotDataClass,
};

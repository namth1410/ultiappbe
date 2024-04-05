import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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

const snapshotDataHomework = async (classId) => {
  try {
    const q = query(
      collection(firestore, "homework"),
      where("class", "==", classId)
    );

    const unsubscribeHomework = onSnapshot(q, (docSnapshot) => {
      io.emit("reload", { homework: classId });
    });

    return unsubscribeHomework;
  } catch (error) {
    console.error("Error snapshotDataHomework:", error);
    throw new Error("Error snapshotDataHomework");
  }
};

const addHomework = async ({
  classId,
  config,
  currentUser,
  correctAnswer,
  nameHomework,
  file,
  nameFile,
}) => {
  try {
    const fileURL = await uploadFile(file, nameFile, classId);
    console.log(fileURL);
    const dataToAdd = {
      dateCreate: new Date().toISOString(),
      uidCreator: JSON.parse(currentUser).uid,
      nameCreator: JSON.parse(currentUser).displayName,
      photoURL: JSON.parse(currentUser).photoURL,
      fileURL: fileURL,
      correctAnswer: JSON.parse(correctAnswer),
      class: classId,
      nameHomework: nameHomework,
      config: JSON.parse(config),
    };

    await addDoc(collection(firestore, "homework"), dataToAdd);
  } catch (error) {
    console.error("Error addHomework:", error);
  }
};

const deleteHomework = async ({ homeworkId, classId }) => {
  try {
    await deleteDoc(doc(firestore, "homework", homeworkId));
  } catch (error) {
    console.error("Error deleteHomework:", error);
  }
};

const getUsersNotDoHomework = async (uids) => {
  try {
    const usersPromises = uids.map((uid) => getUserByUID({ uid }));
    const usersData = await Promise.all(usersPromises);

    return usersData.filter((user) => user !== null);
  } catch (error) {
    console.error("Error getUsersNotDoHomework:", error);
    return [];
  }
};

const getUserByUID = async ({ uid }) => {
  try {
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("uid", "==", uid))
    );
    const usersData = [];
    querySnapshot?.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    return usersData[0] || null;
  } catch (error) {
    console.error("Error getUserByUID:", error);
  }
};

const getAllResultOfHomework = async (homeworkId) => {
  try {
    const q = query(
      collection(firestore, "homework_results"),
      where("homework_id", "==", homeworkId),
      orderBy("dateCreate", "asc")
    );

    return getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          return null;
        }

        const records = [];
        querySnapshot.forEach((doc) => {
          records.push({ ...doc.data(), id: doc.id });
        });

        return records;
      })
      .catch((error) => {
        console.error("Error fetching homework results:", error);
        return null;
      });
  } catch (error) {
    console.error("Error getUsersNotDoHomework:", error);
    return [];
  }
};

const getDataRecordsHomeworkByUID = async (body) => {
  const { uid, homeworkId } = body;
  try {
    const QuerySnapshot = await getDocs(
      query(
        collection(firestore, "homework_results"),
        where("userUid", "==", uid),
        where("homework_id", "==", homeworkId),
        orderBy("dateCreate", "desc")
      )
    );

    if (QuerySnapshot.empty) {
      return null;
    }
    const records = [];

    QuerySnapshot.forEach((doc) => {
      records.push({ ...doc.data(), id: doc.id });
    });
    return records;
  } catch (error) {
    console.error("Error getDataRecordsHomeworkByUID:", error);
    return [];
  }
};

const getDataHomeworkById = async (body) => {
  const { homeworkId } = body;
  try {
    const docSnapshot = await getDoc(doc(firestore, "homework", homeworkId));
    return { id: docSnapshot.id, ...docSnapshot.data() };
  } catch (error) {
    console.error("Error getDataHomeworkById:", error);
    return [];
  }
};

const updateHomeworkById = async (body) => {
  const { homeworkId, config, correctAnswer, nameHomework } = body;
  try {
    const homeworkRef = doc(firestore, "homework", homeworkId);
    const docSnap = await getDoc(homeworkRef);
    const tmp = docSnap.data();
    if (docSnap.exists()) {
      const dataToAdd = {
        dateCreate: new Date().toISOString(),
        uidCreator: tmp.uidCreator,
        nameCreator: tmp.nameCreator,
        photoURL: tmp.photoURL,
        fileURL: tmp.fileURL,
        correctAnswer: correctAnswer,
        class: tmp.class,
        nameHomework: nameHomework,
        config: config,
      };
      await updateDoc(homeworkRef, dataToAdd);
    }
  } catch (error) {
    console.error("Error getDataHomeworkById:", error);
    return [];
  }
};

const uploadFile = async (file, nameFile, classId) => {
  const storageRef = ref(storage, `Homework/${classId}#${nameFile}`);
  const snapshot = await uploadBytes(storageRef, file.buffer);
  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log("File available at", downloadURL);
  return downloadURL;
};

export {
  addHomework,
  deleteHomework,
  getAllResultOfHomework,
  getDataHomeworkById,
  getDataRecordsHomeworkByUID,
  getUsersNotDoHomework,
  snapshotDataHomework,
  updateHomeworkById,
};

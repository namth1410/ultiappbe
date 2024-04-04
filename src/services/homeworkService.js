import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
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
      correctAnswer: correctAnswer,
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

const uploadFile = async (file, nameFile, classId) => {
  const storageRef = ref(storage, `Homework/${classId}#${nameFile}`);
  const snapshot = await uploadBytes(storageRef, file.buffer);
  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log("File available at", downloadURL);
  return downloadURL;
};

export { addHomework, deleteHomework, snapshotDataHomework };

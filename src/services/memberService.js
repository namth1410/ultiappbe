import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase.js";

const getMembersOfClass = async (dataClass) => {
  const promises = dataClass.members.map((userId) => {
    const userQuery = query(
      collection(firestore, "users"),
      where("uid", "==", userId)
    );
    return getDocs(userQuery);
  });

  return Promise.all(promises)
    .then((userSnapshotsArray) => {
      const usersData = [];
      userSnapshotsArray.forEach((userSnapshots) => {
        userSnapshots.forEach((snapshot) => {
          usersData.push({ id: snapshot.id, ...snapshot.data() });
        });
      });
      return usersData;
    })
    .catch((error) => {
      console.error("Error getMembersOfClass:", error);
    });
};

const removeMemberFromClass = async ({ classId, memberId }) => {
  try {
    const classRef = doc(firestore, "classes", classId);

    await runTransaction(firestore, async (transaction) => {
      const classDoc = await transaction.get(classRef);
      if (!classDoc.exists()) {
        throw new Error("Class document does not exist.");
      }
      const members = classDoc.data().members || [];

      const updatedMembers = members.filter((id) => id !== memberId);

      transaction.update(classRef, { members: updatedMembers });
    });
  } catch (error) {
    console.error("Error removeMemberFromClass:", error);
  }
};

const getUserByEmail = async ({ email }) => {
  try {
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("email", "==", email))
    );
    const usersData = [];
    querySnapshot?.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    return usersData[0] || null;
  } catch (error) {
    console.error("Error getUserByEmail:", error);
  }
};

const deleteRequestJoinClass = async ({ id }) => {
  try {
    await deleteDoc(doc(firestore, "notifications", id));
    return null;
  } catch (error) {
    console.error("Error deleteRequestJoinClass:", error);
  }
};

const addUserToClass = async ({ classId, uid, currentUser }) => {
  try {
    const classRef = doc(firestore, "classes", classId);
    const docSnap = await getDoc(classRef);
    if (docSnap.exists()) {
      const classData = docSnap.data();
      if (!classData.members?.includes(uid)) {
        let dataToAdd = {};
        if (!classData.members || !Array.isArray(classData.members)) {
          dataToAdd.members = [uid];
        } else {
          dataToAdd.members = [...classData.members, uid];
        }
        await updateDoc(classRef, dataToAdd);
        const _notification = {
          dateCreate: new Date().toISOString(),
          uidCreator: currentUser.uid,
          nameCreator: currentUser.displayName,
          photoURL: currentUser.photoURL,
          class: classId,
          content: `Bạn đã được thêm vào lớp ${classData.nameClass}`,
          type: "normal",
          receiver: [`${uid}$unread`],
        };
        await addDoc(collection(firestore, "notifications"), _notification);
      }
    }
    return null;
  } catch (error) {
    console.error("Error addUserToClass:", error);
  }
};

export {
  addUserToClass,
  deleteRequestJoinClass,
  getMembersOfClass,
  getUserByEmail,
  removeMemberFromClass,
};

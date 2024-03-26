import {
  getUserCreatedClasses,
  getUserJoinedClasses,
  getClassById,
} from "../services/classService.js";

const getUserCreatedClassesController = async (req, res) => {
  const { uid } = req.user;
  try {
    const userCreatedClasses = await getUserCreatedClasses(uid);
    if (userCreatedClasses === null) {
      return res
        .status(404)
        .json({ message: "User has not created any classes." });
    }
    return res.status(200).json(userCreatedClasses);
  } catch (error) {
    console.error("Error in getUserCreatedClassesController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserJoinedClassesController = async (req, res) => {
  const { currentUser } = req;
  try {
    const userJoinedClasses = await getUserJoinedClasses(currentUser);
    if (userJoinedClasses === null) {
      return res
        .status(404)
        .json({ message: "User has not joined any classes." });
    }
    return res.status(200).json(userJoinedClasses);
  } catch (error) {
    console.error("Error in getUserJoinedClassesController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getClassByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const classInfo = await getClassById(id);
    if (classInfo === null) {
      return res.status(404).json({ message: "Class not found." });
    }
    return res.status(200).json(classInfo);
  } catch (error) {
    console.error("Error in getClassByIdController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getUserCreatedClassesController,
  getUserJoinedClassesController,
  getClassByIdController,
};

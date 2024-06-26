import {
  getClassById,
  getHomeworkOfClass,
  getUserCreatedClasses,
  getUserJoinedClasses,
  snapshotDataClass,
} from "../services/classService.js";

const snapshotController = async (req, res) => {
  const { classId } = req.params;
  try {
    const dataClass = await snapshotDataClass(classId);
    if (dataClass === null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(dataClass);
  } catch (error) {
    console.error("Error in snapshotController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
  const { uid } = req.user;
  try {
    const userJoinedClasses = await getUserJoinedClasses(uid);
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

const getHomworkOfClassController = async (req, res) => {
  const { id } = req.params;
  try {
    const classInfo = await getHomeworkOfClass(id);
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
  getClassByIdController,
  getHomworkOfClassController,
  getUserCreatedClassesController,
  getUserJoinedClassesController,
  snapshotController,
};

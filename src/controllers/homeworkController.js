import {
  addHomework,
  deleteHomework,
  getAllResultOfHomework,
  getDataHomeworkById,
  getDataRecordsHomeworkByUID,
  getUsersNotDoHomework,
  snapshotDataHomework,
  updateHomeworkById,
} from "../services/homeworkService.js";

const snapshotController = async (req, res) => {
  const { classId } = req.params;
  try {
    const dataHomework = await snapshotDataHomework(classId);
    if (dataHomework === null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(dataHomework);
  } catch (error) {
    console.error("Error in snapshotController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addHomeworkController = async (req, res) => {
  const body = { ...req.body, file: req.file };

  try {
    const homework = await addHomework(body);
    if (homework === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(homework);
  } catch (error) {
    console.error("Error in addHomeworkController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteHomeworkController = async (req, res) => {
  const body = req.body;
  try {
    const members = await deleteHomework(body);
    if (members === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error in addUserToClassController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUsersNotDoHomeworkController = async (req, res) => {
  const body = req.body;
  try {
    const users = await getUsersNotDoHomework(body);
    if (users === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersNotDoHomeworkController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllResultOfHomeworkController = async (req, res) => {
  const { homeworkId } = req.params;
  try {
    const users = await getAllResultOfHomework(homeworkId);
    if (users === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllResultOfHomeworkController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getDataRecordsHomeworkByUIDController = async (req, res) => {
  const body = req.body;
  try {
    const records = await getDataRecordsHomeworkByUID(body);
    if (records === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(records);
  } catch (error) {
    console.error("Error in getDataRecordsHomeworkByUIDController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getDataHomeworkByIdController = async (req, res) => {
  const body = req.body;
  try {
    const records = await getDataHomeworkById(body);
    if (records === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(records);
  } catch (error) {
    console.error("Error in getDataHomeworkByIdController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateHomeworkByIdController = async (req, res) => {
  const body = req.body;
  try {
    const records = await updateHomeworkById(body);
    if (records === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(records);
  } catch (error) {
    console.error("Error in updateHomeworkByIdController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  addHomeworkController,
  deleteHomeworkController,
  getAllResultOfHomeworkController,
  getDataHomeworkByIdController,
  getDataRecordsHomeworkByUIDController,
  getUsersNotDoHomeworkController,
  snapshotController,
  updateHomeworkByIdController,
};

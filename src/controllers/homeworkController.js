import {
  addHomework,
  deleteHomework,
  snapshotDataHomework,
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

export { addHomeworkController, deleteHomeworkController, snapshotController };

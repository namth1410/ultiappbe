import {
  addUserToClass,
  deleteRequestJoinClass,
  getMembersOfClass,
  getUserByEmail,
  removeMemberFromClass,
} from "../services/memberService.js";

const getMembersOfClassController = async (req, res) => {
  const dataClass = req.body;
  try {
    const members = await getMembersOfClass(dataClass);
    if (members === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error in getMembersOfClassController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const removeMemberFromClassController = async (req, res) => {
  const { classId, memberId } = req.body;
  try {
    const members = await removeMemberFromClass({
      classId: classId,
      memberId: memberId,
    });
    if (members === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error in getMembersOfClassController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserByEmailController = async (req, res) => {
  const email = req.body.params;
  try {
    const user = await getUserByEmail(email);
    if (user === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserByEmailController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRequestJoinClassController = async (req, res) => {
  const id = req.body;
  try {
    const members = await deleteRequestJoinClass(id);
    if (members === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error in deleteRequestJoinClassController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addUserToClassController = async (req, res) => {
  const body = req.body;
  try {
    const members = await addUserToClass(body);
    if (members === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error in addUserToClassController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  addUserToClassController,
  deleteRequestJoinClassController,
  getMembersOfClassController,
  getUserByEmailController,
  removeMemberFromClassController,
};

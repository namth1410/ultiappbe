import {
  deleteNewsfeed,
  getNewsfeedOfClass,
  postCommentNewsfeed,
  postNewsfeed,
  snapshotNewsfeed,
} from "../services/newsfeedService.js";

const snapshotController = async (req, res) => {
  const { classId } = req.params;
  try {
    const newsfeed = await snapshotNewsfeed(classId);
    if (newsfeed === null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(newsfeed);
  } catch (error) {
    console.error("Error in snapshotController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getNewsfeedController = async (req, res) => {
  const { classId } = req.params;
  try {
    const newsfeed = await getNewsfeedOfClass(classId);
    if (newsfeed === null) {
      return res.status(200).json([]);
    }
    return res.status(200).json(newsfeed);
  } catch (error) {
    console.error("Error in getNewsfeedController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const postNewsfeedController = async (req, res) => {
  const data = { ...req.body, imageNewFeed: req.file };
  try {
    const newsfeed = await postNewsfeed(data);
    if (newsfeed === null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(newsfeed);
  } catch (error) {
    console.error("Error in postNewsfeedController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNewsfeedController = async (req, res) => {
  const { newsfeedId } = req.params;
  console.log(req.params);
  try {
    const newsfeed = await deleteNewsfeed(newsfeedId);
    if (newsfeed === null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(newsfeed);
  } catch (error) {
    console.error("Error in deleteNewsfeedController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const postCommentNewsfeedController = async (req, res) => {
  const data = { ...req.body };
  try {
    const newsfeed = await postCommentNewsfeed(data);
    if (newsfeed === null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(newsfeed);
  } catch (error) {
    console.error("Error in postCommentNewsfeedController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  deleteNewsfeedController,
  getNewsfeedController,
  postCommentNewsfeedController,
  postNewsfeedController,
  snapshotController,
};

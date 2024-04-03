import {
  getNewsfeedOfClass,
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
    console.error("Error in getNewsfeedController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getNewsfeedController = async (req, res) => {
  const { classId } = req.params;
  try {
    const newsfeed = await getNewsfeedOfClass(classId);
    if (newsfeed === null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(newsfeed);
  } catch (error) {
    console.error("Error in getNewsfeedController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getNewsfeedController, snapshotController };

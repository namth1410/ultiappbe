import { Router } from "express";
import {
  deleteNewsfeedController,
  getNewsfeedController,
  postCommentNewsfeedController,
  postNewsfeedController,
  snapshotController,
} from "../controllers/newsfeedController.js";
import multer from "multer";

const router = Router();
const upload = multer();

router.get("/snapshot/:classId", snapshotController);
router.get("/get/:classId", getNewsfeedController);
router.post(
  "/post-newsfeed",
  upload.single("imageNewFeed"),
  postNewsfeedController
);
router.delete("/delete-newsfeed/:newsfeedId", deleteNewsfeedController);
router.post("/post-comment", postCommentNewsfeedController);

export default router;

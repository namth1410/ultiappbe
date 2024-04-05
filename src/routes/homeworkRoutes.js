import { Router } from "express";
import multer from "multer";
import {
  addHomeworkController,
  deleteHomeworkController,
  getAllResultOfHomeworkController,
  getDataHomeworkByIdController,
  getDataRecordsHomeworkByUIDController,
  getUsersNotDoHomeworkController,
  snapshotController,
  updateHomeworkByIdController
} from "../controllers/homeworkController.js";

const router = Router();
const upload = multer();

router.get("/snapshot/:classId", snapshotController);
router.delete("/delete", deleteHomeworkController);
router.post("/post", upload.single("file"), addHomeworkController);
router.post("/get-users-not-do-homework", getUsersNotDoHomeworkController);
router.get(
  "/get-all-result-of-homework/:homeworkId",
  getAllResultOfHomeworkController
);
router.post(
  "/get-records-homework-by-uid",
  getDataRecordsHomeworkByUIDController
);
router.post("/get-data-homework-by-id", getDataHomeworkByIdController);
router.post("/update-homework-by-id", updateHomeworkByIdController);

export default router;

import { Router } from "express";
import {
  addHomeworkController,
  deleteHomeworkController,
  snapshotController,
} from "../controllers/homeworkController.js";
import multer from "multer";


const router = Router();
const upload = multer();

router.get("/snapshot/:classId", snapshotController);
router.delete("/delete", deleteHomeworkController);
router.post("/post", upload.single("file"), addHomeworkController);

export default router;

import { Router } from "express";
import {
  getClassByIdController,
  getHomworkOfClassController,
  getUserCreatedClassesController,
  getUserJoinedClassesController,
  snapshotController,
} from "../controllers/classController.js";

const router = Router();

router.get("/snapshot/:classId", snapshotController);

router.get("/user-created", getUserCreatedClassesController);

router.get("/user-joined", getUserJoinedClassesController);

router.get("/:id", getClassByIdController);

// Lấy toàn bộ bài tập của lớp
router.get("/homework-of-class/:id", getHomworkOfClassController);

export default router;

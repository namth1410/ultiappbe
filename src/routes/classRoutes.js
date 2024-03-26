import { Router } from "express";
import {
  getClassByIdController,
  getUserCreatedClassesController,
  getUserJoinedClassesController,
} from "../controllers/classController.js";

const router = Router();

router.get("/user-created", getUserCreatedClassesController);

router.get("/user-joined", getUserJoinedClassesController);

router.get("/:id", getClassByIdController);

export default router;

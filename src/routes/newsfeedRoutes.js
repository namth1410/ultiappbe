import { Router } from "express";
import {
  getNewsfeedController,
  snapshotController,
} from "../controllers/newsfeedController.js";

const router = Router();

router.get("/snapshot/:classId", snapshotController);
router.get("/get/:classId", getNewsfeedController);

export default router;

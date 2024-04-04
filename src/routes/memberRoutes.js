import { Router } from "express";
import {
  addUserToClassController,
  deleteRequestJoinClassController,
  getMembersOfClassController,
  getUserByEmailController,
  removeMemberFromClassController,
} from "../controllers/memberController.js";

const router = Router();
router.post("/get", getMembersOfClassController);
router.delete("/delete", removeMemberFromClassController);
router.get("/get-user-by-email", getUserByEmailController);
router.delete("/delete-request-join-class", deleteRequestJoinClassController);
router.post("/accept-request-join-class", addUserToClassController);

export default router;

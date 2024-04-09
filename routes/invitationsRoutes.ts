import { Router } from "express";
import sendInvitationController from "../controllers/Invitations/sendInvitationController";
import getInvitationController from "../controllers/Invitations/getInvitationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, sendInvitationController);
router.get("/:userId", authMiddleware, getInvitationController);


export default router;

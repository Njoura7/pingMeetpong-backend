import { Router } from "express";
import sendInvitationController from "../controllers/Invitations/sendInvitationController";
import handleInvitationController from "../controllers/Invitations/handleInvitationController";
import getInvitationController from "../controllers/Invitations/getInvitationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, sendInvitationController);
router.post("/handle", authMiddleware, handleInvitationController);
router.get("/:userId", authMiddleware, getInvitationController);


export default router;

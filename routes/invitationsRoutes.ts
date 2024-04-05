import { Router } from "express";
import sendInvitationController from "../controllers/Invitations/sendInvitationController";
import getInvitationController from "../controllers/Invitations/getInvitationController";
import handleInvitationController from "../controllers/Invitations/handleInvitationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { io } from "../src/socketServer"; // Import io from socketServer.ts

const router = Router();

// Define the route for sending invitations
router.post("/send", authMiddleware, (req, res) =>
  sendInvitationController(req, res, io)
);

// Define the route for getting invitations
router.get("/", authMiddleware, (req, res) =>
  getInvitationController(req, res, io)
);

// Define the route for handling invitations
router.post("/handle", authMiddleware, (req, res) =>
  handleInvitationController(req, res, io)
);

export default router;

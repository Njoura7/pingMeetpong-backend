import { Router } from "express";
import {
  createMatch,
//   updateMatch,
//   getMatchesByUserId,
} from "../controllers/matchController";
import { findMatchesByPlayer } from "../controllers/findMatchesController";
import joinMatchController from "../controllers/joinMatchController";

import { authMiddleware } from "../middlewares/authMiddleware"; // Import the middleware


const router = Router();

router.post("/",authMiddleware, createMatch);
router.post("/join", authMiddleware, joinMatchController);

router.get("/player/:playerId",authMiddleware, findMatchesByPlayer);

// router.put("/:id", updateMatch);

export default router;

import { Router } from "express";
import  createMatchController  from "../controllers/Matches/createMatchController";
import  findMatchesByPlayerController  from "../controllers/Matches/findMatchesByPlayerController";
import joinMatchController from "../controllers/Matches/joinMatchController";
import addMatchScoreController from "../controllers/Matches/addMatchScoreController";

import { authMiddleware } from "../middlewares/authMiddleware"; // Import the middleware


const router = Router();

router.post("/",authMiddleware, createMatchController);
router.post("/join", authMiddleware, joinMatchController);

router.get("/player/:playerId",authMiddleware, findMatchesByPlayerController);

router.post("/score", authMiddleware, addMatchScoreController);



export default router;

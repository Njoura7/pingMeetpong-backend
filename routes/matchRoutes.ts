import { Router } from "express";
import {
  createMatch,
//   updateMatch,
//   getMatchesByUserId,
} from "../controllers/matchController";

const router = Router();

router.post("/", createMatch);

// router.get("/user/:userId", getMatchesByUserId);

// router.put("/:id", updateMatch);

export default router;

import { Router } from "express";
import getUserByIdController from "../controllers/Users/getUserByIdController"

import { authMiddleware } from "../middlewares/authMiddleware"; // Import the middleware 

const router = Router();

router.get("/:userId", authMiddleware, getUserByIdController);


export default router;

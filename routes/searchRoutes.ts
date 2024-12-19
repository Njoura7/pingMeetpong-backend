// searchRoutes.ts
import { Router } from "express";
import  searchUsers  from "../controllers/Search/searchController";

import { authMiddleware } from "../middlewares/authMiddleware"; 


const router = Router();

router.get("/",authMiddleware, searchUsers);

export default router;

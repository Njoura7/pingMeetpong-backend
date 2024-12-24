"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createMatchController_1 = __importDefault(require("../controllers/Matches/createMatchController"));
const findMatchesByPlayerController_1 = __importDefault(require("../controllers/Matches/findMatchesByPlayerController"));
const joinMatchController_1 = __importDefault(require("../controllers/Matches/joinMatchController"));
const addMatchScoreController_1 = __importDefault(require("../controllers/Matches/addMatchScoreController"));
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Import the middleware
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, createMatchController_1.default);
router.post("/join", authMiddleware_1.authMiddleware, joinMatchController_1.default);
router.get("/player/:playerId", authMiddleware_1.authMiddleware, findMatchesByPlayerController_1.default);
router.post("/score", authMiddleware_1.authMiddleware, addMatchScoreController_1.default);
exports.default = router;

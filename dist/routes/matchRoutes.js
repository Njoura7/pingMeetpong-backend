"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createMatchController_1 = __importDefault(require("../controllers/Matches/createMatchController"));
const findMatchesController_1 = __importDefault(require("../controllers/Matches/findMatchesController"));
const joinMatchController_1 = __importDefault(require("../controllers/Matches/joinMatchController"));
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Import the middleware
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, createMatchController_1.default);
router.post("/join", authMiddleware_1.authMiddleware, joinMatchController_1.default);
router.get("/player/:playerId", authMiddleware_1.authMiddleware, findMatchesController_1.default);
exports.default = router;

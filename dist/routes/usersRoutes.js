"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getUserByIdController_1 = __importDefault(require("../controllers/Users/getUserByIdController"));
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Import the middleware 
const router = (0, express_1.Router)();
router.get("/:userId", authMiddleware_1.authMiddleware, getUserByIdController_1.default);
exports.default = router;

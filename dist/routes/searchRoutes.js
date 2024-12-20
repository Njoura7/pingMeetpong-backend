"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// searchRoutes.ts
const express_1 = require("express");
const searchController_1 = __importDefault(require("../controllers/Search/searchController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, searchController_1.default);
exports.default = router;

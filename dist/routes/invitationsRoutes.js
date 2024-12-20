"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sendInvitationController_1 = __importDefault(require("../controllers/Invitations/sendInvitationController"));
const handleInvitationController_1 = __importDefault(require("../controllers/Invitations/handleInvitationController"));
const getInvitationController_1 = __importDefault(require("../controllers/Invitations/getInvitationController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, sendInvitationController_1.default);
router.post("/handle", authMiddleware_1.authMiddleware, handleInvitationController_1.default);
router.get("/:userId", authMiddleware_1.authMiddleware, getInvitationController_1.default);
exports.default = router;

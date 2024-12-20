"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../db/models/User"));
const getNotificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        // Find the user and populate pendingRequests
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }
        // Return success response
        return res.status(200).json({
            message: "Invitations retrieved successfully.",
            pendingRequests: user.pendingRequests,
            sentRequests: user.sentRequests,
            friends: user.friends,
        });
    }
    catch (error) {
        console.error("Error retrieving invitations:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving the invitations.",
        });
    }
});
exports.default = getNotificationController;

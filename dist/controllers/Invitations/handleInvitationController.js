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
const mongoose_1 = __importDefault(require("mongoose"));
const handleInvitationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, invitationId, action } = req.body;
    // Validate input
    if (!userId || !invitationId || !action) {
        return res.status(400).json({ message: "User ID, Invitation ID, and action are required." });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(invitationId)) {
        return res.status(400).json({ message: "Invalid user IDs." });
    }
    if (!["accept", "reject"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'accept' or 'reject'." });
    }
    try {
        const [user, sender] = yield Promise.all([
            User_1.default.findById(userId),
            User_1.default.findById(invitationId)
        ]);
        if (!user || !sender) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!user.pendingRequests.includes(sender._id)) {
            return res.status(400).json({ message: "No pending invitation from this user." });
        }
        if (action === "accept") {
            user.friends.push(sender._id);
            sender.friends.push(user._id);
        }
        user.pendingRequests = user.pendingRequests.filter(id => !id.equals(sender._id));
        sender.sentRequests = sender.sentRequests.filter(id => !id.equals(user._id));
        yield Promise.all([user.save(), sender.save()]);
        return res.status(200).json({ message: `Invitation ${action}ed successfully.` });
    }
    catch (error) {
        console.error("Error handling invitation:", error);
        return res.status(500).json({ message: "An error occurred while handling the invitation." });
    }
});
exports.default = handleInvitationController;

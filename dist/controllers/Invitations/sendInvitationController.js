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
const socket_1 = require("../../socket");
const mongoose_1 = __importDefault(require("mongoose"));
const sendInvitationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, recipientId } = req.body;
    // Validate input
    if (!senderId || !recipientId) {
        return res
            .status(400)
            .json({ message: "Sender ID and Recipient ID are required." });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(senderId) ||
        !mongoose_1.default.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ message: "Invalid user IDs." });
    }
    if (senderId === recipientId) {
        return res
            .status(400)
            .json({ message: "You cannot send an invitation to yourself." });
    }
    try {
        const [sender, recipient] = yield Promise.all([
            User_1.default.findById(senderId),
            User_1.default.findById(recipientId),
        ]);
        if (!sender || !recipient) {
            return res.status(404).json({ message: "One or both users not found." });
        }
        const senderHasPendingFromRecipient = sender.pendingRequests.some((id) => id.equals(recipient._id));
        const recipientHasPendingFromSender = recipient.pendingRequests.some((id) => id.equals(sender._id));
        if (senderHasPendingFromRecipient || recipientHasPendingFromSender) {
            return res
                .status(400)
                .json({ message: "An invitation is already pending." });
        }
        const [updateRecipient, updateSender] = yield Promise.all([
            User_1.default.findByIdAndUpdate(recipientId, { $addToSet: { pendingRequests: sender._id } }, { new: true }),
            User_1.default.findByIdAndUpdate(senderId, { $addToSet: { sentRequests: recipient._id } }, { new: true }),
        ]);
        if (!updateRecipient || !updateSender) {
            return res.status(500).json({ message: "Failed to update users." });
        }
        const recipientSocketId = (0, socket_1.getRecipientSocketId)(recipientId);
        if (recipientSocketId) {
            socket_1.io.to(recipientSocketId).emit("newNotification", {
                senderId: sender._id,
                senderUsername: sender.username,
                senderAvatar: sender.avatar,
            });
        }
        return res.status(200).json({ message: "Invitation sent successfully." });
    }
    catch (error) {
        console.error("Error sending invitation:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while sending the invitation." });
    }
});
exports.default = sendInvitationController;

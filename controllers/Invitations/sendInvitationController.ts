import User from "../../db/models/User";
import { Request, Response } from "express";
import { getRecipientSocketId, io } from "../../src/socket";
import mongoose from "mongoose";

const sendInvitationController = async (req: Request, res: Response) => {
  const { senderId, recipientId } = req.body;

  // Validate input
  if (!senderId || !recipientId) {
    return res
      .status(400)
      .json({ message: "Sender ID and Recipient ID are required." });
  }

  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(recipientId)
  ) {
    return res.status(400).json({ message: "Invalid user IDs." });
  }

  if (senderId === recipientId) {
    return res
      .status(400)
      .json({ message: "You cannot send an invitation to yourself." });
  }

  try {
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    const senderHasPendingFromRecipient = sender.pendingRequests.some((id) =>
      id.equals(recipient._id)
    );
    const recipientHasPendingFromSender = recipient.pendingRequests.some((id) =>
      id.equals(sender._id)
    );

    if (senderHasPendingFromRecipient || recipientHasPendingFromSender) {
      return res
        .status(400)
        .json({ message: "An invitation is already pending." });
    }

    const [updateRecipient, updateSender] = await Promise.all([
      User.findByIdAndUpdate(
        recipientId,
        { $addToSet: { pendingRequests: sender._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        senderId,
        { $addToSet: { sentRequests: recipient._id } },
        { new: true }
      ),
    ]);

    if (!updateRecipient || !updateSender) {
      return res.status(500).json({ message: "Failed to update users." });
    }

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newNotification", {
        senderId: sender._id,
        senderUsername: sender.username,
        senderAvatar: sender.avatar,
      });
    }

    return res.status(200).json({ message: "Invitation sent successfully." });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while sending the invitation." });
  }
};

export default sendInvitationController;

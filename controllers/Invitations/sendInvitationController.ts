import User from "../../db/models/User";
import { Request, Response } from "express";
import { getRecipientSocketId, io, userSocketMap } from "../../src/socket";

const sendInvitationController = async (req: Request, res: Response) => {
  const { senderId, recipientId } = req.body;

  try {
    // Find the sender user
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        message: "Sender not found.",
        data: null,
      });
    }
    // Find the recipient user
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found.",
        data: null,
      });
    }

    // Check if sender's ID already exists in recipient's pendingRequests
    if (recipient.pendingRequests.includes(senderId)) {
      return res.status(400).json({
        message: "You already sent an invitation to this account.",
        data: null,
      });
    }

    // Update recipient's pendingRequests
    const updatedRecipient = await User.findByIdAndUpdate(
      recipientId,
      { $addToSet: { pendingRequests: senderId } }, // we use $addToSet to ensure uniqueness
      { new: true } // return the updated document after the update operation
    );

    if (!updatedRecipient) {
      return res.status(404).json({
        message: "Recipient not found.",
        data: null,
      });
    }

    // Get sender's username and avatar
    const senderUsername = sender.username;
    const senderAvatar = sender.avatar;

    // Emit newNotification event with sender data
    const recipientSocketId: string | undefined =
      getRecipientSocketId(recipientId);
    console.log("recipientSocketId", recipientSocketId);
    console.log("recipientId", recipientId);
    if (recipientSocketId) {
      const notificationData = {
        senderId,
        senderUsername,
        senderAvatar,
      };
    
      io.to(recipientSocketId).emit("newNotification", notificationData);

      // Log the data that's being emitted
      console.log("Emitted newNotification event with data:", notificationData);
    }
    // Return success response
    return res.status(200).json({
      message: "Invitation sent successfully.",
      sender: {
        _id: sender._id,
        username: sender.username,
        avatar: sender.avatar,
      },
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({
      message: "An error occurred while sending the invitation.",
      data: null,
    });
  }
};

export default sendInvitationController;

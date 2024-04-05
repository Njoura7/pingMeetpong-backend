import User from "../../db/models/User";
import { Request, Response } from "express";
import { Server } from "socket.io";

const sendInvitationController = async (
  req: Request,
  res: Response,
  io: Server
) => {
  const { senderId, recipientId } = req.body;

  try {
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
    // Add sender's ID to recipient's pendingRequests
    const updatedRecipient = await User.findByIdAndUpdate(
      recipientId,
      { $push: { pendingRequests: senderId } },
      { new: true } // Return the updated document after the update operation
    );
      //! Typescript will give error if we dont make sure that 
      //! the updatedRecipient is not null
      
      if (!updatedRecipient) {
        return res.status(404).json({
          message: "Recipient not found.",
          data: null,
        });
      }

    // Emit Socket.IO event to notify recipient about new friend request
    io.to(recipientId).emit("friendRequest", { senderId });

  

    // Respond with success message
    return res.status(200).json({
      message: "Invitation sent successfully.",
      data: updatedRecipient.pendingRequests,
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

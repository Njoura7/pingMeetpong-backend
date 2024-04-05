import User from "../../db/models/User";
import { Request, Response } from "express";
import { Server } from "socket.io";

const handleInvitationController = async (
  req: Request,
  res: Response,
  io: Server
) => {
  const { userId, senderId, action } = req.body; // action can be 'accept' or 'reject'

  try {
    let updatedUser;
    if (action === "accept") {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { pendingRequests: senderId },
          $push: { friends: senderId },
        },
        { new: true }
      );
      if (updatedUser) {
        const sender = await User.findById(senderId);
        io.to(senderId).emit("invitationAccepted", { userId });
        return res.status(200).json({
          message: `You are now friends with ${sender?.username}`,
          data: updatedUser,
        });
      }
    } else if (action === "reject") {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { pendingRequests: senderId } },
        { new: true }
      );
      if (updatedUser) {
        io.to(senderId).emit("invitationRejected", { userId });
        return res.status(200).json({
          message: "Invitation rejected successfully.",
          data: updatedUser,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid action.",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error handling invitation:", error);
    return res.status(500).json({
      message: "An error occurred while handling the invitation.",
      data: null,
    });
  }
};

export default handleInvitationController;
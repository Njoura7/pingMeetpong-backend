import User from "../../db/models/User";
import { Request, Response } from "express";

const handleInvitationController = async (req: Request, res: Response) => {
  const { userId, senderId, action } = req.body; // action can be 'accept' or 'reject'

  try {
    let updatedUser;
    let updatedSender;

    // logic for accepting an invitation
    if (action === "accept") {
      [updatedUser, updatedSender] = await Promise.all([
        User.findByIdAndUpdate(
          userId,
          {
            $pull: { pendingRequests: senderId },
            $push: { friends: senderId },
          },
          { new: true }
        ),
        User.findByIdAndUpdate(
          senderId,
          {
            $pull: { sentRequests: userId },
            $push: { friends: userId },
          },
          { new: true }
        ),
      ]);

      if (updatedUser && updatedSender) {
        return res.status(200).json({
          message: `You are now friends with ${updatedSender.username}`,
          data: updatedUser,
        });
      }
    }

    // logic for rejecting an invitation
    else if (action === "reject") {
      [updatedUser, updatedSender] = await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { pendingRequests: senderId } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          senderId,
          { $pull: { sentRequests: userId } },
          { new: true }
        ),
      ]);

      if (updatedUser && updatedSender) {
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

import User from "../../db/models/User";
import { Request, Response } from "express";
import mongoose from "mongoose";

const handleInvitationController = async (req: Request, res: Response) => {
  const { userId, invitationId, action } = req.body;

  // Validate input
  if (!userId || !invitationId || !action) {
    return res.status(400).json({ message: "User ID, Invitation ID, and action are required." });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(invitationId)) {
    return res.status(400).json({ message: "Invalid user IDs." });
  }

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Must be 'accept' or 'reject'." });
  }

  try {
    const [user, sender] = await Promise.all([
      User.findById(userId),
      User.findById(invitationId)
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

    await Promise.all([user.save(), sender.save()]);

    return res.status(200).json({ message: `Invitation ${action}ed successfully.` });
  } catch (error) {
    console.error("Error handling invitation:", error);
    return res.status(500).json({ message: "An error occurred while handling the invitation." });
  }
};

export default handleInvitationController;
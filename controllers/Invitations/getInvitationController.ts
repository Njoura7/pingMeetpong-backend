import User from "../../db/models/User";
import { Request, Response } from "express";

const getNotificationController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Find the user and populate pendingRequests
    const user = await User.findById(userId)
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
  } catch (error) {
    console.error("Error retrieving invitations:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the invitations.",
    });
  }
};

export default getNotificationController;

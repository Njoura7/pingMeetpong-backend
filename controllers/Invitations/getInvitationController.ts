import User from "../../db/models/User";
import { Request, Response } from "express";

const getNotificationController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Find the user and populate pendingRequests
    const user = await User.findById(userId)
        .populate("pendingRequests", "username avatar _id friends") // Only get username, avatar, _id, and friends from pendingRequests
        .select("-password"); // Exclude password from the main user document
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        data: null,
      });
    }

    // Return success response
    return res.status(200).json({
      message: "Invitations retrieved successfully.",
      data: user.pendingRequests,
    });
  } catch (error) {
    console.error("Error retrieving invitations:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the invitations.",
      data: null,
    });
  }
};

export default getNotificationController;

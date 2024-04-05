import User from "../../db/models/User";
import { Request, Response } from "express";
import { Server } from "socket.io";

const getInvitationController = async (
  req: Request,
  res: Response,
  io: Server
) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        data: null,
      });
    }

    io.on("friendRequest", async (data: { senderId: string }) => {
      const sender = await User.findById(data.senderId);
      if (sender) {
        io.to(userId).emit("newInvitation", {
          message: `You have a new friend request from ${sender.username}`,
          data: sender,
        });
      }
    });

    return res.status(200).json({
      message: "Listening for new invitations.",
      data: null,
    });
  } catch (error) {
    console.error("Error getting invitations:", error);
    return res.status(500).json({
      message: "An error occurred while getting the invitations.",
      data: null,
    });
  }
};

export default getInvitationController;
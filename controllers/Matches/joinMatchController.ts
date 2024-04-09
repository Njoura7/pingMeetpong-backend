import mongoose from "mongoose";
import Match from "../../db/models/Match";
import { Request, Response } from "express";

const joinMatchController = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { code } = req.body; // Get the code from the request body
  const userId = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  // Convert userId to ObjectId
  const userIdObjectId = new mongoose.Types.ObjectId(userId);

  // Find the match with the provided code
  const match = await Match.findOne({ code });

  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }
  // Check if the user is the owner of the match
  if (match.owner.toString() === userId) {
    return res
      .status(400)
      .json({ message: "You cannot join a match that you created" });
  }

  // Check if user has already joined the match
  if (match.players.includes(userIdObjectId)) {
    return res
      .status(400)
      .json({ message: "You have already joined this match" });
  }

  // Check if match already has 4 players
  if (match.players.length >= 4) {
    return res
    .status(400)
    .json({ message: "Maximum players exceeded" });
  }

  // Add the user's ID to the players array
  match.players.push(userIdObjectId);

  // Save the updated match
  const updatedMatch = await match.save();

  // Return the updated match data
  return res.status(200).json({
    message: "Successfully joined the match",
    data: updatedMatch,
  });
};

export default joinMatchController;

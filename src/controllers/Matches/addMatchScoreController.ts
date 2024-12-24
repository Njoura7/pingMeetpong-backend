import Match from "../../db/models/Match";
import { Request, Response } from "express";
import mongoose from "mongoose";

const addMatchScoreController = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { matchId, score } = req.body;
  const userId = req.user;

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required.",
      data: null
    });
  }

  if (!matchId || !score) {
    return res.status(400).json({ 
      message: "Match ID and score are required.",
      data: null
    });
  }

  // Validate matchId format
  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    return res.status(400).json({
      message: "Invalid match ID format.",
      data: null
    });
  }

  try {
    // Find the match and populate players for better response data
    const match = await Match.findById(matchId).populate('players', 'username');
    
    if (!match) {
      return res.status(404).json({ 
        message: "Match not found.",
        data: null
      });
    }

    // Convert userId to ObjectId for comparison
    const userIdObj = new mongoose.Types.ObjectId(userId);

    // Check if the user is either the owner or a player in the match
    const isParticipant = match.owner.equals(userIdObj) || 
                         match.players.some(playerId => playerId.equals(userIdObj));

    if (!isParticipant) {
      return res.status(403).json({ 
        message: "Only match participants can add scores.",
        data: null
      });
    }

    // Update the match score
    match.score = score;
    await match.save();

    res.status(200).json({
      message: "Score added successfully.",
      data: match,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in adding match score:", err.message);
      res.status(400).json({ message: err.message, data: null });
    } else {
      console.error("An unknown error occurred:", err);
      res.status(500).json({ 
        message: "An unknown error occurred", 
        data: null 
      });
    }
  }
};

export default addMatchScoreController;

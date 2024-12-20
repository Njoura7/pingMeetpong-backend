import Match from "../../db/models/Match";
import User from "../../db/models/User";
import { Request, Response } from "express";

 const findMatchesByPlayerController = async (req: Request, res: Response) => {
  const { playerId } = req.params;

  try {
    // Find the player user
    const player = await User.findById(playerId);
    if (!player) {
      return res.status(404).json({ 
        message: "Player user not found.",
        data: null,
      });
    }

    // Find matches where the player is included in the players array
    const matches = await Match.find({
      $or:[
        {players:{$in:[playerId]}},
        {owner:playerId}
      ]
    })

    res.status(200).json({
      message: "Matches found successfully.",
      data: matches,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in finding matches by player:", err.message);
      res.status(400).json({ message: err.message, data: null });
    } else {
      console.error("An unknown error occurred:", err);
      res.status(500).json({ message: "An unknown error occurred", data: null });
    }
  }
};

export default findMatchesByPlayerController;
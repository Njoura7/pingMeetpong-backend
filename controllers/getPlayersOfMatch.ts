import Match from "../db/models/Match";
import { Request, Response } from "express";

export const getPlayersOfMatch = async (req: Request, res: Response) => {
  const { matchId } = req.params;

  try {
    // Find the match and populate the players field
    const match = await Match.findById(matchId).populate("players");

    if (!match) {
      return res.status(404).json({
        message: "Match not found.",
        data: null,
      });
    }

    // Get the players
    const players = match.players;

    res.status(200).json({
      message: "Players retrieved successfully.",
      data: players,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in retrieving players:", err.message);
      res.status(400).json({ message: err.message, data: null });
    } else {
      console.error("An unknown error occurred:", err);
      res
        .status(500)
        .json({ message: "An unknown error occurred", data: null });
    }
  }
};

import Match from "../db/models/Match";
import { Request, Response } from "express";


export const createMatch = async (req:Request, res:Response) => {
  const { name, code, place, date } = req.body;
  try {
    const match = new Match({ name, code, place, date });
    await match.save();
    res.status(201).json({
      message: "Match created successfully.",
      data: match,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in match creation:", err.message);
      res.status(400).json({ message: err.message, data: null });
    } else {
      console.error("An unknown error occurred:", err);
      res
        .status(500)
        .json({ message: "An unknown error occurred", data: null });
    }
  }
};

// export const getMatchesByUserId = async (req, res) => {
//   // Implement the logic to get all matches for a specific user
// };

// export const updateMatch = async (req, res) => {
//   // Implement the logic to update a match
// };

import Match from "../db/models/Match";
import { Request, Response } from "express";
import { loginUser } from "../controllers/authController";

export const createMatch = async (req: Request &{user?: string}, res: Response) => {
  const { name, code, place, date } = req.body;
  const userId = req.user; // Get the user's ID from req.user

  try {
    // Check if match with the same name or code already exists
    const existingMatch = await Match.findOne({ $or: [{ name }, { code }] });
    if (existingMatch) {
      return res.status(400).json({
        message: "Match with the same name or code already exists.",
        data: null,
      });
    }
    const match = new Match({ name, code, place, date, owner: userId });
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

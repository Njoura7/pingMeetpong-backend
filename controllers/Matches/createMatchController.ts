import Match from "../../db/models/Match";
import { Request, Response } from "express";
import crypto from "crypto";


 const createMatchController = async (
  req: Request & { user?: string },
  res: Response
) => {
  const { name, place, date } = req.body;
  const userId = req.user; // Get the user's ID from req.user

  try {
    // Check if match with the same name already exists
    const existingMatch = await Match.findOne({ name });
    if (existingMatch) {
      return res.status(400).json({
        message: "Match with the same name already exists.",
        data: null,
      });
    }

    let code;
    let matchWithCode;
    do {
      code = crypto.randomBytes(3).toString("hex").slice(0, 5); // Generate a new code
      matchWithCode = await Match.findOne({ code }); // Check if a match with this code already exists
    } while (matchWithCode);

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
export default createMatchController;
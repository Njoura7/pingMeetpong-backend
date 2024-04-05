import User from "../../db/models/User";
import { Request, Response } from "express";

const getUserByIdController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        data: null,
      });
    }

    res.status(200).json({
      message: "User found successfully.",
      data: user,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in finding user by id:", err.message);
      res.status(400).json({ message: err.message, data: null });
    } else {
      console.error("An unknown error occurred:", err);
      res
        .status(500)
        .json({ message: "An unknown error occurred", data: null });
    }
  }
};

export default getUserByIdController;

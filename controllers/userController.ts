import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (username: string, password: string , avatar:string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  await User.create({ username, password, avatar });
};

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Username doesn't exist");
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Wrong password, try again");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  return { user: user._id, accessToken: token, username:user.username, avatar: user.avatar };
};

import { Router } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.create({ username, password });
    res.status(201).send("User created successfully. Please log in.");
  } catch (err) {
    res.status(400).send("Error, user not created");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env file");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).json({ user: user._id, accessToken: token });
  } catch (err) {
    res.status(400).send("Incorrect username or password");
  }
});

export default router;

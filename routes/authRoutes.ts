import { Router } from "express";
import User from "../models/User";
import { registerUser, loginUser } from "../controllers/userController";


const router = Router();

  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ username });
      try {
        await registerUser(username, password);
        res
          .status(201)
          .json({ message: "User created successfully. Please log in." });
      } catch (err) {
         const message = (err as Error).message;
         res.status(400).json({ message });
      }
  });

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await loginUser(username, password);
      res.status(200).json(result);
    } catch (err) {
       const message = (err as Error).message;
       res.status(400).json({ message });
    }
  });

export default router;

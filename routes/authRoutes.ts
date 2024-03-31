import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";

const router = Router();

router.post("/register", async (req, res) => {
  const { username, password, avatar } = req.body;
  try {
    await registerUser(username, password, avatar);
    res.status(201).json({
      message: "User created successfully. Please log in.",
      data: null,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in user registration:", err.message);
      res.status(400).json({ message: err.message, data: null });
    } else {
      console.error("An unknown error occurred:", err);
      res
        .status(500)
        .json({ message: "An unknown error occurred", data: null });
    }
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await loginUser(username, password);
    res.status(200).json({
      message: "Login successful.",
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in user login:", err.message);
      res.status(400).json({ message: err.message, data: null });
    } else {
      console.error("An unknown error occurred:", err);
      res
        .status(500)
        .json({ message: "An unknown error occurred", data: null });
    }
  }
});

export default router;

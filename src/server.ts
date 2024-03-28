import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "../routes/authRoutes";


dotenv.config();

const port = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI;
const env = process.env.NODE_ENV;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const app = express();

// Use built-in Express middleware for parsing JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cors middleware
app.use(cors());

// Use routers
app.use("/api", authRoutes);


mongoose
  .connect(uri)
  .then(() => {
    console.log(`Successfully connected to MongoDB in ${env} mode!`);
    app.listen(port, () =>
      console.log(`Server is running on port ${port} in ${env} mode`)
    );
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send(`Hello World, running in ${env} mode`);
});

// Global error handler
app.use((err:any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


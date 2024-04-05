import express from "express";
import { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "../db/connectDB";
import authRoutes from "../routes/authRoutes";
import matchRoutes from "../routes/matchRoutes";
import usersRoutes from "../routes/usersRoutes";
import invitationsRoutes from "../routes/invitationsRoutes";

import { io } from "./socketServer"; // Import io from socketServer.ts

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
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/invitations", invitationsRoutes);

// Attach Socket.IO server to the HTTP server
const httpServer = createServer(app);
io.attach(httpServer);

// Start the HTTP server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// catch errors from the connectDB function
connectDB().catch((error) => {
  console.error(`Failed to connect to MongoDB: ${error.message}`);
});

app.get("/", (req, res) => {
  res.send(`Hello World, running in ${env} mode`);
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

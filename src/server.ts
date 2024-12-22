import express from "express";
import { Request, Response, NextFunction } from "express";
import { app, httpServer} from "./socket";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB";
import authRoutes from "./routes/authRoutes";
import matchRoutes from "./routes/matchRoutes";
import usersRoutes from "./routes/usersRoutes";
import invitationsRoutes from "./routes/invitationsRoutes";
import searchRoutes from "./routes/searchRoutes";

dotenv.config();

const port = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI;
const env = process.env.NODE_ENV;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}



// Use built-in Express middleware for parsing JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Use cors middleware
// app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up and running!");
});

// Use routers
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/invitations", invitationsRoutes);
app.use("/api/search", searchRoutes);


// Start the HTTP server
httpServer.listen(port,  () => {
  console.log(`Server is running on port ${port} in ${env} mode`);

  connectDB().catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
  });
});


// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../db/connect"; 
import authRoutes from "../routes/authRoutes";
import matchRoutes from "../routes/matchRoutes";


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
app.use("/api/matches/player", matchRoutes);


// Use the connectDB function
connectDB().then(() => {
  app.listen(port, () =>
    console.log(`Server is running on port ${port} in ${env} mode`)
  );
});

app.get("/", (req, res) => {
  res.send(`Hello World, running in ${env} mode`);
});

// Global error handler
app.use((err:any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


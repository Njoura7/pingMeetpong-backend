import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export const connectDB = () => {
  return mongoose
    .connect(uri)
    .then(() => {
      console.log(`Successfully connected to MongoDB!`);
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });
};

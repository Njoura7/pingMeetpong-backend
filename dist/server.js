// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// dotenv.config();
// const port = process.env.PORT || 5000;
// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }
// const app = express(); // Initialize your Express application here
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("Successfully connected to MongoDB!");
//     app.listen(port, () => console.log(`Server is running on port ${port}`));
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   });
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });
import fs from "fs";
console.log("Hello World");
fs.writeFileSync("hello.txt", "Hello World");
//# sourceMappingURL=server.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
}
const connectDB = () => {
    return mongoose_1.default
        .connect(uri)
        .then(() => {
        console.log(`Successfully connected to MongoDB!`);
    })
        .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });
};
exports.connectDB = connectDB;

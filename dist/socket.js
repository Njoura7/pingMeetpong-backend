"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketMap = exports.httpServer = exports.io = exports.app = exports.getRecipientSocketId = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http"); // createServer from "http"
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
// Attach Socket.IO server to the HTTP server
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.PROD, // Allow both URLs
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true, // Include credentials if needed
    },
});
exports.io = io;
const userSocketMap = {};
exports.userSocketMap = userSocketMap;
const getRecipientSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getRecipientSocketId = getRecipientSocketId;
io.on("connection", (socket) => {
    // console.log("user connected",socket.id);
    const userId = socket.handshake.query.userId;
    if (typeof userId === "string") {
        userSocketMap[userId] = socket.id;
        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
        socket.on("disconnect", () => {
            // console.log("user disconnected",socket.id);
            delete userSocketMap[userId];
        });
    }
});

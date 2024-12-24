"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_1 = require("./socket");
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = require("./db/connectDB");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const matchRoutes_1 = __importDefault(require("./routes/matchRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const invitationsRoutes_1 = __importDefault(require("./routes/invitationsRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
dotenv_1.default.config();
const port = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI;
const env = process.env.NODE_ENV;
if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
}
// Use built-in Express middleware for parsing JSON and urlencoded bodies
socket_1.app.use(express_1.default.json());
socket_1.app.use(express_1.default.urlencoded({ extended: true }));
// // Use cors middleware
// app.use(cors());
socket_1.app.get("/", (req, res) => {
    res.send("Server is up and running!");
});
// Use routers
socket_1.app.use("/api/auth", authRoutes_1.default);
socket_1.app.use("/api/matches", matchRoutes_1.default);
socket_1.app.use("/api/users", usersRoutes_1.default);
socket_1.app.use("/api/invitations", invitationsRoutes_1.default);
socket_1.app.use("/api/search", searchRoutes_1.default);
// Start the HTTP server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)();
        socket_1.httpServer.listen(port, () => {
            console.log(`Server is running on port ${port} in ${env} mode`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Failed to connect to MongoDB: ${error.message}`);
        }
        else {
            console.error('Failed to connect to MongoDB: Unknown error occurred');
        }
        process.exit(1);
    }
});
startServer();
// Global error handler
socket_1.app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

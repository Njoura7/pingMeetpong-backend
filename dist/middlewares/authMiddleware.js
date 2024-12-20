"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return res
            .status(500)
            .json({ message: "JWT_SECRET is not defined in .env file" });
    }
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authorizationHeader.split(" ")[1];
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decodedToken && decodedToken.id) {
            req.user = decodedToken.id;
            next();
        }
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.authMiddleware = authMiddleware;

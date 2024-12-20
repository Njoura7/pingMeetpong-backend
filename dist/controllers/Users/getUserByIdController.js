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
const User_1 = __importDefault(require("../../db/models/User"));
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const user = yield User_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }
        res.status(200).json({
            message: "User found successfully.",
            data: user,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error in finding user by id:", err.message);
            res.status(400).json({ message: err.message });
        }
        else {
            console.error("An unknown error occurred:", err);
            res
                .status(500)
                .json({ message: "An unknown error occurred" });
        }
    }
});
exports.default = getUserByIdController;

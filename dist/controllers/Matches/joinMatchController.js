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
const mongoose_1 = __importDefault(require("mongoose"));
const Match_1 = __importDefault(require("../../db/models/Match"));
const joinMatchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body; // Get the code from the request body
    const userId = req.user;
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" });
    }
    // Convert userId to ObjectId
    const userIdObjectId = new mongoose_1.default.Types.ObjectId(userId);
    // Find the match with the provided code
    const match = yield Match_1.default.findOne({ code });
    if (!match) {
        return res.status(404).json({ message: "Match not found" });
    }
    // Check if the user is the owner of the match
    if (match.owner.toString() === userId) {
        return res
            .status(400)
            .json({ message: "You cannot join a match that you created" });
    }
    // Check if user has already joined the match
    if (match.players.includes(userIdObjectId)) {
        return res
            .status(400)
            .json({ message: "You have already joined this match" });
    }
    // Check if match already has 4 players
    if (match.players.length >= 3) {
        return res
            .status(400)
            .json({ message: "Maximum players exceeded" });
    }
    // Add the user's ID to the players array
    match.players.push(userIdObjectId);
    // Save the updated match
    const updatedMatch = yield match.save();
    // Return the updated match data
    return res.status(200).json({
        message: "Successfully joined the match",
        data: updatedMatch,
    });
});
exports.default = joinMatchController;

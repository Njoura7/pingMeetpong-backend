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
const Match_1 = __importDefault(require("../../db/models/Match"));
const mongoose_1 = __importDefault(require("mongoose"));
const addMatchScoreController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matchId, score } = req.body;
    const userId = req.user;
    if (!userId) {
        return res.status(401).json({
            message: "Authentication required.",
            data: null
        });
    }
    if (!matchId || !score) {
        return res.status(400).json({
            message: "Match ID and score are required.",
            data: null
        });
    }
    // Validate matchId format
    if (!mongoose_1.default.Types.ObjectId.isValid(matchId)) {
        return res.status(400).json({
            message: "Invalid match ID format.",
            data: null
        });
    }
    try {
        // Find the match and populate players for better response data
        const match = yield Match_1.default.findById(matchId).populate('players', 'username');
        if (!match) {
            return res.status(404).json({
                message: "Match not found.",
                data: null
            });
        }
        // Convert userId to ObjectId for comparison
        const userIdObj = new mongoose_1.default.Types.ObjectId(userId);
        // Check if the user is either the owner or a player in the match
        const isParticipant = match.owner.equals(userIdObj) ||
            match.players.some(playerId => playerId.equals(userIdObj));
        if (!isParticipant) {
            return res.status(403).json({
                message: "Only match participants can add scores.",
                data: null
            });
        }
        // Update the match score
        match.score = score;
        yield match.save();
        res.status(200).json({
            message: "Score added successfully.",
            data: match,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error in adding match score:", err.message);
            res.status(400).json({ message: err.message, data: null });
        }
        else {
            console.error("An unknown error occurred:", err);
            res.status(500).json({
                message: "An unknown error occurred",
                data: null
            });
        }
    }
});
exports.default = addMatchScoreController;

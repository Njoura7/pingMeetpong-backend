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
exports.getPlayersOfMatchController = void 0;
const Match_1 = __importDefault(require("../../db/models/Match"));
const getPlayersOfMatchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matchId } = req.params;
    try {
        // Find the match and populate the players field
        const match = yield Match_1.default.findById(matchId).populate("players");
        if (!match) {
            return res.status(404).json({
                message: "Match not found.",
                data: null,
            });
        }
        // Get the players
        const players = match.players;
        res.status(200).json({
            message: "Players retrieved successfully.",
            data: players,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error in retrieving players:", err.message);
            res.status(400).json({ message: err.message, data: null });
        }
        else {
            console.error("An unknown error occurred:", err);
            res
                .status(500)
                .json({ message: "An unknown error occurred", data: null });
        }
    }
});
exports.getPlayersOfMatchController = getPlayersOfMatchController;

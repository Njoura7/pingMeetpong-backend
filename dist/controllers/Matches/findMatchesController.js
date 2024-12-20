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
const User_1 = __importDefault(require("../../db/models/User"));
const findMatchesByPlayerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playerId } = req.params;
    try {
        // Find the player user
        const player = yield User_1.default.findById(playerId);
        if (!player) {
            return res.status(404).json({
                message: "Player user not found.",
                data: null,
            });
        }
        // Find matches where the player is included in the players array
        const matches = yield Match_1.default.find({
            $or: [
                { players: { $in: [playerId] } },
                { owner: playerId }
            ]
        });
        res.status(200).json({
            message: "Matches found successfully.",
            data: matches,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error in finding matches by player:", err.message);
            res.status(400).json({ message: err.message, data: null });
        }
        else {
            console.error("An unknown error occurred:", err);
            res.status(500).json({ message: "An unknown error occurred", data: null });
        }
    }
});
exports.default = findMatchesByPlayerController;

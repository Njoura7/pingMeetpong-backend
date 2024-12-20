"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const matchSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    place: { type: String, required: true },
    date: { type: Date, required: true },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    players: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
});
const Match = mongoose_1.default.model("match", matchSchema);
exports.default = Match;

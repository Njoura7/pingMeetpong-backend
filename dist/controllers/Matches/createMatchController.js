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
const crypto_1 = __importDefault(require("crypto"));
const createMatchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, place, date } = req.body;
    const userId = req.user; // Get the user's ID from req.user
    try {
        // Check if match with the same name already exists
        const existingMatch = yield Match_1.default.findOne({ name });
        if (existingMatch) {
            return res
                .status(400)
                .json({ message: "Match with the same name already exists." });
        }
        let code;
        let matchWithCode;
        do {
            code = crypto_1.default.randomBytes(3).toString("hex").slice(0, 5); // Generate a new code
            matchWithCode = yield Match_1.default.findOne({ code }); // Check if a match with this code already exists
        } while (matchWithCode);
        const match = new Match_1.default({ name, code, place, date, owner: userId });
        yield match.save();
        res.status(201).json({
            message: "Match created successfully.",
            data: match,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error in match creation:", err.message);
            res
                .status(400)
                .json({ message: err.message, data: null });
        }
        else {
            console.error("An unknown error occurred:", err);
            res
                .status(500)
                .json({ message: "An unknown error occurred", data: null });
        }
    }
});
exports.default = createMatchController;

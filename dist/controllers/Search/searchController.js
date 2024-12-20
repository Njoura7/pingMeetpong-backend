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
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.query.q; // Retrieve the search term from the query parameter
    if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required" });
    }
    try {
        console.log("Search term:", searchTerm);
        const users = yield User_1.default.aggregate([
            {
                $search: {
                    autocomplete: {
                        query: searchTerm,
                        path: "username",
                        fuzzy: {
                            maxEdits: 1,
                            prefixLength: 1, // Allows autocomplete from the first letter
                        },
                        score: { boost: { value: 2 } }, // Boost relevance for matches starting with the search term
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    score: { $meta: "searchScore" },
                },
            },
            {
                $sort: { score: -1 }, // Sort by the most relevant
            },
        ]);
        console.log("Users:", users);
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = searchUsers;

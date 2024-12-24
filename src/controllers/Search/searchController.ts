import { Request, Response } from "express";
import User from "../../db/models/User";

const searchUsers = async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string; // Retrieve the search term from the query parameter

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    console.log("Search term:", searchTerm);

 const users = await User.aggregate([
   {
     $search: {
       autocomplete: {
         query: searchTerm,
         path: "username",
         fuzzy: { maxEdits: 1, prefixLength: 1 },
         score: { boost: { value: 2 } },
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
   { $sort: { score: -1 } },
 ]);




    console.log("Users:", users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default searchUsers;

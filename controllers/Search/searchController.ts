import { Request, Response } from "express";
import User from "../../db/models/User";

const searchUsers = async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string; // Retrieve the search term from the query parameter

  try {
    console.log("Search term:", searchTerm);

    const users = await User.aggregate([
      {
        $search: {
          index: "searchUsers", // specify the index name
          text: {
            query: searchTerm,
            path: "username",
            fuzzy: {},
          },
        },
      },
      {
        $project: {
          // project only the fields you need
          _id: 1,
          score: { $meta: "searchScore" },
          username: 1,
          avatar: 1,
          friends: 1,
        },
      },
    ])

    console.log("Users:", users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default searchUsers;

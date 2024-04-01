import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (
  req: Request & { user?: string },
  res: Response,
  next: NextFunction
) => {
  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({ message: "JWT_SECRET is not defined in .env file" });
  }

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
    if (decodedToken && decodedToken.id) {
      req.user = decodedToken.id;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
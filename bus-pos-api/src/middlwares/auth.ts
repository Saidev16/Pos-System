import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded !== "object" || !decoded?.userId) {
      res.status(401).json({ error: "Invalid token" });
    }
    (req as any).user = decoded;

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = (req as any).user;
      if (!allowedRoles.includes(role)) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };
};

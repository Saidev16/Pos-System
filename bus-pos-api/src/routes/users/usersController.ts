import { users } from "@db/schema";
import { db } from "@db/connection";
import bycrypt from "bcryptjs";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import jwt from "jsonwebtoken";
import { config } from "@config/config";
export class UsersController {
  async register(req: Request, res: Response) {
    try {
      const user = req.body;

      user.password = await bycrypt.hash(user.password, 10);

      await db.insert(users).values(user);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const isValidPassword = await bycrypt.compare(password, user.password);

      if (!isValidPassword) {
        res.status(400).json({ error: "Invalid password" });
        return;
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: "1d" }
      );
      res.status(200).json({ token, user });
      return;
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
      return;
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
}

import { Router } from "express";
import { UsersController } from "./usersController";
import { valiateData } from "../../middlwares/validateData";
import { createUserSchema, loginSchema } from "../../db/schema";

const router = Router();
const usersController = new UsersController();

// Routes
router.post(
  "/register",
  valiateData(createUserSchema),
  usersController.register
);
router.post("/login", valiateData(loginSchema), usersController.login);

export default router;

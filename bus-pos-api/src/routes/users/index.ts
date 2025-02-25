import { Router } from "express";
import { UsersController } from "./usersController";
import { valiateData } from "@middlwares/validateData";
import { createUserSchema, loginSchema } from "@db/schemas/usersSchema";

const router = Router();
const usersController = new UsersController();

// Routes
router.post(
  "/register",
  valiateData(createUserSchema),
  usersController.register
);
router.post("/login", valiateData(loginSchema), usersController.login);

router.get("/profile", usersController.getProfile);
export default router;

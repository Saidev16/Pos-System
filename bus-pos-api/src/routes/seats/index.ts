import { Router } from "express";
import { SeatsController } from "./seatsController";

const router = Router();
const seatsController = new SeatsController();

// Routes
router.post("/");
router.get("/");
router.get("/:id");
router.patch("/:id/payment");

export default router;

import { Router } from "express";
import { BookingsController } from "./bookingsController";

const router = Router();
const bookingsController = new BookingsController();

// Routes
router.post("/");
router.get("/");
router.get("/:id");
router.patch("/:id/payment");

export default router;

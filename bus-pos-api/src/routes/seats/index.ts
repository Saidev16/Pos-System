import { Router } from "express";
import { SeatsController } from "./seatsController";
import { authMiddleware, authorize } from "../../middlwares/auth";
import { valiateData } from "../../middlwares/validateData";
import { createSeatsSchema, updateSeatSchema } from "../../db/schema";

const router = Router();
const seatsController = new SeatsController();

// Routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin"]),
  valiateData(createSeatsSchema),
  seatsController.createSeats
);
router.get("/trip/:tripId", seatsController.getTripSeats);

router.put(
  "/:seatId/availability",
  authMiddleware,
  valiateData(updateSeatSchema),
  seatsController.updateSeatAvailability
);

export default router;

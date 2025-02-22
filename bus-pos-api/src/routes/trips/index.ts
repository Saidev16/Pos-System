import { Router } from "express";
import { valiateData } from "../../middlwares/validateData";
import { createTripSchema, searchTripSchema } from "../../db/schema";
import { TripsController } from "./tripsController";
import { authMiddleware, authorize } from "../../middlwares/auth";

const router = Router();

const tripsController = new TripsController();

router.post(
  "/",
  authMiddleware,
  authorize(["admin"]),
  valiateData(createTripSchema),
  tripsController.createTrip
);
router.post(
  "/search",
  valiateData(searchTripSchema),
  tripsController.searchTrips
);

router.get("/:id", tripsController.getTripById);

export default router;

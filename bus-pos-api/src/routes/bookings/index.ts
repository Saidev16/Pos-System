import { Router } from "express";
import { BookingsController } from "./bookingsController";
import { valiateData } from "@middlwares/validateData";
import { createBookingSchema } from "@db/schemas/bookingsSchema";
import { authMiddleware } from "@middlwares/auth";

const router = Router();
const bookingsController = new BookingsController();

// Routes
router.post(
  "/",
  valiateData(createBookingSchema),
  authMiddleware,
  bookingsController.createBooking
);
router.get("/", authMiddleware, bookingsController.getBookings);
router.get("/:id", authMiddleware, bookingsController.getBooking);
router.put(
  "/:id/payment",
  authMiddleware,
  bookingsController.updatePaymentStatus
);

export default router;

import { Request, Response } from "express";
import { db } from "@db/connection";
import { bookings as bookingsTable, seats } from "@db/schema";
import { eq } from "drizzle-orm";

export class BookingsController {
  async createBooking(req: Request, res: Response) {
    try {
      const booking = req.body;
      const newBooking = await db
        .insert(bookingsTable)
        .values({
          ...booking,
          userId: (req as any).user.id,

          isPaid: false,
        })
        .$returningId();

      // Update seat availability
      const { seatId } = booking;

      await db
        .update(seats)
        .set({ isAvailable: false })
        .where(eq(seats.id, seatId));

      res.status(201).json(newBooking[0]);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async getBookings(req: Request, res: Response) {
    try {
      const bookings = await db.select().from(bookingsTable);

      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async getBooking(req: Request, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const [booking] = await db
        .select()
        .from(bookingsTable)
        .where(eq(bookingsTable.id, bookingId))
        .limit(1);

      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [booking] = await db
        .update(bookingsTable)
        .set({ isPaid: true })
        .where(eq(bookingsTable.id, id));

      res.status(200).json(booking);
      return;
    } catch (err) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
}

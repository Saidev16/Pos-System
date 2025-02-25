import { Request, Response } from "express";

import { seats as seatsTable } from "../../db/schema";
import { db } from "../../db/connection";
import { eq } from "drizzle-orm";
export class SeatsController {
  async createSeats(req: Request, res: Response) {
    try {
      const { tripId, seats } = req.body;

      const seatsData = seats.map(
        (seat: { seatNumber: number; seatPosition: "window" | "aisle" }) => ({
          tripId,
          seatNumber: seat.seatNumber,
          seatPosition: seat.seatPosition,
          isAvailable: true,
        })
      );

      console.log(seatsData);
      await db.insert(seatsTable).values(seatsData);
      // Create seats
      res.status(201).json(seatsData);
    } catch (err) {
      res.status(500).json({ error: "Failed to create seats" });
    }
  }

  async getTripSeats(req: Request, res: Response) {
    try {
      const tripId = Number(req.params.tripId);
      const tripSeats = await db
        .select()
        .from(seatsTable)
        .where(eq(seatsTable.tripId, tripId));
      res.status(200).json(tripSeats);
      return;
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch seats" });
      return;
    }
  }

  async updateSeatAvailability(req: Request, res: Response) {
    try {
      const seatId = Number(req.params.seatId);
      const { isAvailable } = req.body;
      await db
        .update(seatsTable)
        .set({ isAvailable })
        .where(eq(seatsTable.id, seatId));
      res.status(200).json({ message: "Seat updated successfully" });
      return;
    } catch (error) {
      res.status(500).json({ error: "Failed to update seat" });
      return;
    }
  }
}

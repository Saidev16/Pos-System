import { Request, Response } from "express";
import { db } from "../../db/connection";
import { seats, trips } from "../../db/schema";
import { and, eq } from "drizzle-orm";
export class TripsController {
  async createTrip(req: Request, res: Response) {
    try {
      const tripData = {
        ...req.body,
        departureDate: new Date(req.body.departureDate),
      };

      // Create the trip
      const [trip] = await db.insert(trips).values(tripData).$returningId();

      // Create seats for the trip
      const totalSeats = Number(req.body.totalSeats);

      // Generate seat data with proper typing
      const seatsToCreate = [];
      for (let i = 1; i <= totalSeats; i++) {
        // Explicitly type the seat position to match the enum
        const seatPosition: "window" | "aisle" =
          i % 2 === 0 ? "window" : "aisle";

        seatsToCreate.push({
          tripId: trip.id,
          seatNumber: i,
          seatPosition,
          isAvailable: true,
        });
      }

      // Insert all seats in a single transaction if there are seats to create
      if (seatsToCreate.length > 0) {
        await db.insert(seats).values(seatsToCreate);
      }

      res.status(201).json({ ...trip, seats: seatsToCreate.length });
    } catch (err) {
      res.status(500).json({ error: "SFailed to create trip" });
    }
  }
  async searchTrips(req: Request, res: Response) {
    try {
      const searchData = {
        ...req.body,
        departureDate: new Date(req.body.departureDate),
      };
      const searchResults = await db
        .select()
        .from(trips)
        .where(
          and(
            eq(trips.departureCity, searchData.departureCity),
            eq(trips.destinationCity, searchData.destinationCity),
            eq(trips.departureDate, searchData.departureDate)
          )
        );

      if (!searchResults.length) {
        res.status(200).json([]);
        return;
      }

      res.status(200).json(searchResults);
    } catch (err) {
      res.status(500).json({ error: "Failed to search trips" });
    }
  }

  async getTripById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [trip] = await db.select().from(trips).where(eq(trips.id, id));
      res.status(200).json(trip);
    } catch (err) {
      res.status(500).json({ error: "Failed to get trip" });
    }
  }
}

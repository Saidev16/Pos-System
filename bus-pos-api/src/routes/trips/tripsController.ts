import { Request, Response } from "express";
import { db } from "../../db/connection";
import { trips } from "../../db/schema";
import { and, eq } from "drizzle-orm";
export class TripsController {
  async createTrip(req: Request, res: Response) {
    try {
      const tripData = {
        ...req.body,
        departureDate: new Date(req.body.departureDate),
      };
      const trip = await db.insert(trips).values(tripData);
      res.status(201).json(trip);
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
        res.status(404).json({ error: "No trips found" });
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

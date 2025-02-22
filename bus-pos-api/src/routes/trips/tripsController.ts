import { Request, Response } from "express";
import { db } from "../../db/connection";
import { trips } from "../../db/schema";
import { and, eq } from "drizzle-orm";
export class TripsController {
  async createTrip(req: Request, res: Response) {
    try {
      const [trip] = await db.insert(trips).values(req.body);
      res.status(201).json(trip);
    } catch (err) {
      res.status(500).json({ error: "SFailed to create trip" });
    }
  }
  async searchTrips(req: Request, res: Response) {
    try {
      const { departureCity, destinationCity, departureDate } = req.body;
      const searchResults = await db
        .select()
        .from(trips)
        .where(
          and(
            eq(trips.departureCity, departureCity),
            eq(trips.destinationCity, destinationCity),
            eq(trips.departureDate, departureDate)
          )
        );

      res.status(200).json(searchResults);
    } catch (err) {
      res.status(500).json({ error: "Failed to search trips" });
    }
  }

  async getTripById(req: Request, res: Response) {
    try {
      const id = Number(req.params);
      const [trip] = await db.select().from(trips).where(eq(trips.id, id));
      res.status(200).json(trip);
    } catch (err) {
      res.status(500).json({ error: "Failed to get trip" });
    }
  }
}

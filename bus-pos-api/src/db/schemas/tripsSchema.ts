import { relations } from "drizzle-orm";
import {
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { seats } from "./seatsSchema";
import { bookings } from "./bookingsSchema";
import { z } from "zod";

export const trips = mysqlTable("trips", {
  id: int("id").primaryKey().autoincrement(),
  departureCity: varchar("departure_city", { length: 100 }).notNull(),
  destinationCity: varchar("destination_city", { length: 100 }).notNull(),
  departureDate: timestamp("departure_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  busNumber: varchar("bus_number", { length: 20 }).notNull(),
  totalSeats: int("total_seats").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tripRelations = relations(trips, ({ many }) => ({
  seats: many(seats),
  bookings: many(bookings),
}));

// Zod Validations for creating a trip
export const createTripSchema = z.object({
  departureCity: z.string().min(1, "Departure city is required"),
  destinationCity: z.string().min(1, "Destination city is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  price: z.number().positive("Price must be positive"),
  busNumber: z.string().min(1, "Bus number is required"),
  totalSeats: z.number().int().positive("Total seats must be positive"),
});

// Zod Validations for Trips
export const searchTripSchema = z.object({
  departureCity: z.string().min(1),
  destinationCity: z.string().min(1),
  departureDate: z.string(),
});

export type TripCreate = z.infer<typeof createTripSchema>;

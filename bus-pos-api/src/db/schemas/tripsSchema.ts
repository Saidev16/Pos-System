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

export const searchTripSchema = z.object({
  departureCity: z.string().min(1),
  destinationCity: z.string().min(1),
  departureDate: z.string(),
});

import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
} from "drizzle-orm/mysql-core";
import { trips } from "./tripsSchema";
import { bookings } from "./bookingsSchema";
import { z } from "zod";

export const seats = mysqlTable("seats", {
  id: int("id").primaryKey().autoincrement(),
  tripId: int("trip_id").notNull(),
  seatNumber: int("seat_number").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  seatPosition: mysqlEnum("seat_position", ["window", "aisle"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const seatRelations = relations(seats, ({ one }) => ({
  trip: one(trips, {
    fields: [seats.tripId],
    references: [trips.id],
  }),
  booking: one(bookings, {
    fields: [seats.id],
    references: [bookings.seatId],
  }),
}));

// Zod Validations for Seats

export const createSeatSchema = z.object({
  tripId: z.number().int().positive("Trip ID is required"),
  seatNumber: z.number().int().positive("Seat number must be positive"),
  isAvailable: z.boolean().default(true),
  seatPosition: z.enum(["window", "aisle"], {
    errorMap: () => ({
      message: "Seat position must be either window or aisle",
    }),
  }),
});

// Validation for creating multiple seats at once
export const createSeatsSchema = z.object({
  tripId: z.number().int().positive("Trip ID is required"),
  seats: z.array(
    z.object({
      seatNumber: z.number().int().positive("Seat number must be positive"),
      seatPosition: z.enum(["window", "aisle"]),
    })
  ),
});

// Validation for updating seat availability
export const updateSeatSchema = z.object({
  isAvailable: z.boolean(),
});

export type CreateTrip = z.infer<typeof createSeatSchema>;

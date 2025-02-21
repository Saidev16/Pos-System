import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { trips } from "./tripsSchema";
import { seats } from "./seatsSchema";
import { users } from "./usersSchema";
import { z } from "zod";

export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  tripId: int("trip_id").notNull(),
  seatId: int("seat_id").notNull(),
  userId: int("user_id").notNull(),
  passengerName: varchar("passenger_name", { length: 100 }).notNull(),
  passengerPhone: varchar("passenger_phone", { length: 20 }).notNull(),
  passengerEmail: varchar("passenger_email", { length: 100 }),
  isPaid: boolean("is_paid").notNull().default(false),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookingRelations = relations(bookings, ({ one }) => ({
  trip: one(trips, {
    fields: [bookings.tripId],
    references: [trips.id],
  }),
  seat: one(seats, {
    fields: [bookings.seatId],
    references: [seats.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

// Zod Validations for Bookings

export const createBookingSchema = z.object({
  tripId: z.number().int().positive("Trip ID is required"),
  seatId: z.number().int().positive("Seat ID is required"),
  userId: z.number().int().positive("User ID is required"),
  passengerName: z.string().min(1, "Passenger name is required"),
  passengerPhone: z.string().min(1, "Passenger phone is required"),
  passengerEmail: z.string().email("Invalid email").optional(),
  isPaid: z.boolean().default(false),
  totalAmount: z.number().positive("Total amount must be positive"),
});

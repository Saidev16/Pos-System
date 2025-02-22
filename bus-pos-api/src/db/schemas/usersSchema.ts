import { relations } from "drizzle-orm";
import {
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { bookings } from "./bookingsSchema";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  fullname: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  role: mysqlEnum("role", ["admin", "agent"]).notNull().default("agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

// Zod Validations for Users
export const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "agent"]).default("agent"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type CreateUser = z.infer<typeof createUserSchema>;

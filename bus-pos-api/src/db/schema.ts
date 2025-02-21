import {
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const trip = mysqlTable("trips", {
  id: int("id").primaryKey().autoincrement(),
  departureCity: varchar("departure_city", { length: 100 }).notNull(),
  destinationCity: varchar("destination_city", { length: 100 }).notNull(),
  departureDate: timestamp("departure_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

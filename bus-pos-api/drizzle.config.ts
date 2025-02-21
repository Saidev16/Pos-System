import { defineConfig } from "drizzle-kit";
import { config } from "./src/config/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: config.database.url!,
  },
  verbose: true,
  strict: true,
});

import { db } from "./connection";
import { users } from "./schema";
import * as bcrypt from "bcrypt";

async function seed() {
  try {
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedAgentPassword = await bcrypt.hash("agent123", 10);

    await db.insert(users).values([
      {
        username: "admin",
        fullname: "Admin User",
        email: "admin@example.com",
        password: hashedAdminPassword,
        role: "admin",
      },
      {
        username: "agent",
        fullname: "Agent User",
        email: "agent@example.com",
        password: hashedAgentPassword,
        role: "agent",
      },
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

// Log pool errors instead of crashing
pool.on("error", (err) => {
  console.error("Unexpected pg pool error:", err.message);
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// DATABASE CONFIGURATION FOR VERCEL + NEON
// This file connects to PostgreSQL using postgres-js driver, which is optimized for serverless.
// DO NOT use file-based SQLite databases in serverless environments.

// If DATABASE_URL is not provided, we export `db = null` so the
// application can run in a read-only or in-memory fallback mode.
// This prevents hard crashes during builds or when environment
// variables are not configured (e.g., local testing without a DB).
let dbInstance: any = null;
if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL not set — database features will be disabled. " +
      "Set DATABASE_URL in Vercel Environment Variables to enable Postgres."
  );
  dbInstance = null;
} else {
  // Create postgres-js client with SSL FORCED for Neon compatibility
  const client = postgres(process.env.DATABASE_URL, {
    ssl: "require",
    max: 1,
    idle_timeout: process.env.NODE_ENV === "production" ? 10 : undefined,
    connect_timeout: 10,
  });

  // Export drizzle ORM instance
  dbInstance = drizzle(client, { schema });

  // Connection verification (logs to help debug issues)
  if (process.env.NODE_ENV !== "production") {
    console.log("✅ Connected to PostgreSQL database");
    console.log(
      "   Host: " +
        (process.env.DATABASE_URL.match(/host=([^\s&]+)/) ||
          process.env.DATABASE_URL.match(/@([^:]+)/))?.[1] || "unknown"
    );
  }
}

export const db = dbInstance;

// NEON-SPECIFIC CONFIGURATION:
// Neon requires SSL connections. The postgres-js driver automatically handles this
// when the connection string includes sslmode=require or when using a Neon URL.
// If connecting to Neon, ensure your URL uses the format:
// postgresql://user:password@region.neon.tech/database?sslmode=require

// (db exported above as `db`)

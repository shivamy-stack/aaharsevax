import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// DATABASE CONFIGURATION FOR VERCEL + NEON
// This file connects to PostgreSQL using postgres-js driver, which is optimized for serverless.
// DO NOT use file-based SQLite databases in serverless environments.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is required. " +
    "For Vercel: Set DATABASE_URL to your Neon PostgreSQL connection string. " +
    "For local dev: Use a local PostgreSQL instance. " +
    "See POSTGRESQL_MIGRATION.md for detailed setup instructions."
  );
}

// Validate DATABASE_URL is a valid PostgreSQL connection string
if (!process.env.DATABASE_URL.startsWith("postgresql://") && 
    !process.env.DATABASE_URL.startsWith("postgres://")) {
  throw new Error(
    "DATABASE_URL must be a valid PostgreSQL connection string. " +
    "Expected format: postgresql://user:password@host:port/database " +
    "Current value: " + process.env.DATABASE_URL.substring(0, 20) + "..."
  );
}

// NEON-SPECIFIC CONFIGURATION:
// Neon requires SSL connections. The postgres-js driver automatically handles this
// when the connection string includes sslmode=require or when using a Neon URL.
// If connecting to Neon, ensure your URL uses the format:
// postgresql://user:password@region.neon.tech/database?sslmode=require

// Create postgres-js client with SSL FORCED for Neon compatibility
// Neon requires SSL connections. Force SSL=require for all environments
// since Neon connection strings include sslmode=require
const client = postgres(process.env.DATABASE_URL, {
  // FORCE SSL for all environments (Neon requires it)
  ssl: "require",
  // Optimize for serverless: minimize connection time and background work
  // See: https://js.postgres.dev/features/querying/simple
  // For Vercel Functions, connections are temporary and should not be pooled
  max: 1,
  // Timeout after 10 seconds in production
  idle_timeout: process.env.NODE_ENV === "production" ? 10 : undefined,
  connect_timeout: 10,
});

// Export drizzle ORM instance
export const db = drizzle(client, { schema });

// Connection verification (logs to help debug issues)
if (process.env.NODE_ENV !== "production") {
  console.log("✅ Connected to PostgreSQL database");
  console.log(
    "   Host: " + 
    (process.env.DATABASE_URL.match(/host=([^\s&]+)/) || 
     process.env.DATABASE_URL.match(/@([^:]+)/))?.[1] || "unknown"
  );
}

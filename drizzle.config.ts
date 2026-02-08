import { defineConfig } from "drizzle-kit";

// VERCEL + NEON CONFIGURATION FOR DRIZZLE KIT MIGRATIONS
// This configures Drizzle ORM to work with PostgreSQL/Neon in serverless environments.
// Never use SQLite or file-based databases with Vercel (serverless has no persistent filesystem).
// For Vercel deployment: Set DATABASE_URL to your Neon PostgreSQL connection string.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is required. " +
    "Set it to your Neon PostgreSQL connection string before running migrations. " +
    "See POSTGRESQL_MIGRATION.md for setup instructions."
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

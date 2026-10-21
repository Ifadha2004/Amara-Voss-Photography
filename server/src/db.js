import "dotenv/config";
import pg from "pg";

// A pool keeps a few database connections open and reuses them,
// so every request doesn't have to reconnect to Neon.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
import "dotenv/config";
import { betterAuth } from "better-auth";
import { pool } from "./db.js";

export const auth = betterAuth({
  database: pool,                       // users and sessions are stored in your Neon database
  secret: process.env.BETTER_AUTH_SECRET, // signs the session cookie so it can't be forged
  baseURL: process.env.BETTER_AUTH_URL,   // the public address of the app
  trustedOrigins: [process.env.BETTER_AUTH_URL], // which sites may call the auth routes
  emailAndPassword: { enabled: true },
});
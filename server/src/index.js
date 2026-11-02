import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
import photosRouter from "./routes/photos.js";
import eventsRouter from "./routes/events.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import favouritesRouter from "./routes/favourites.js";
import bookingsRouter from "./routes/bookings.js";

import checkoutRouter from "./routes/checkout.js";
import ordersRouter from "./routes/orders.js";

const app = express();

// Better Auth reads the raw request itself, so it must come BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());   // lets our own routes read JSON request bodies

app.use("/api/photos", photosRouter);
app.use("/api/events", eventsRouter);
app.use("/api/favourites", favouritesRouter);
app.use("/api/bookings", bookingsRouter);

app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);

// Health check: proves the server is up AND can talk to the database
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS time");
    res.json({ status: "ok", dbTime: result.rows[0].time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Database connection failed" });
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error("Request failed:", error.message);
  res.status(error.status === 400 ? 400 : 500).json({ error: "Request could not be completed" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
import photosRouter from "./routes/photos.js";
import eventsRouter from "./routes/events.js";

const app = express();
app.use("/api/photos", photosRouter);
app.use("/api/events", eventsRouter);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
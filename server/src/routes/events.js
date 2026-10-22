import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/events -> all events, with spots left worked out by the database
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, type, weekday, day, month, time, duration, location,
              price, capacity,
              already_booked AS "alreadyBooked",
              capacity - already_booked AS "spotsLeft",
              image, description
       FROM events
       ORDER BY id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load events" });
  }
});

export default router;
import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/events -> all events, with spots left worked out by the database
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, e.title, e.type, e.weekday, e.day, e.month, e.time, e.duration,
              e.location, e.price, e.capacity,
              e.already_booked AS "alreadyBooked",
              e.capacity - e.already_booked - COALESCE(SUM(b.seats), 0)::int AS "spotsLeft",
              e.image, e.description
       FROM events e
       LEFT JOIN bookings b ON b.event_id = e.id
       GROUP BY e.id
       ORDER BY e.id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load events" });
  }
});

export default router;
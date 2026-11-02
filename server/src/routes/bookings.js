import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

// GET /api/bookings -> my bookings
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, event_id AS "eventId", seats FROM bookings WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load bookings" });
  }
});

// Purchases must now go through Stripe; clients cannot create free reservations.
router.post("/", (req, res) => res.status(410).json({ error: "Use checkout to book and pay" }));

// DELETE /api/bookings/3 -> cancel my booking for event 3
router.delete("/:eventId", async (req, res) => {
  const eventId = Number(req.params.eventId);
  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "Invalid event id" });
  }
  try {
    await pool.query(
      "DELETE FROM bookings WHERE user_id = $1 AND event_id = $2",
      [req.user.id, eventId]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not cancel booking" });
  }
});

export default router;
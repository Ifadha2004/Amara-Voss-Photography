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

// POST /api/bookings  { eventId, seats } -> reserve seats
router.post("/", async (req, res) => {
  const eventId = Number(req.body?.eventId);
  const seats = Number(req.body?.seats);

  if (!Number.isInteger(eventId) || !Number.isInteger(seats) || seats < 1) {
    return res.status(400).json({ error: "eventId and seats must be whole numbers (seats at least 1)" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // FOR UPDATE locks this event row until we finish, so two people
    // booking the last spots at the same moment can't both succeed.
    const eventResult = await client.query(
      "SELECT capacity, already_booked FROM events WHERE id = $1 FOR UPDATE",
      [eventId]
    );
    if (eventResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Event not found" });
    }
    const { capacity, already_booked } = eventResult.rows[0];

    // seats other people have booked on the site (not mine, since mine gets replaced)
    const takenResult = await client.query(
      `SELECT COALESCE(SUM(seats), 0)::int AS taken
       FROM bookings WHERE event_id = $1 AND user_id <> $2`,
      [eventId, req.user.id]
    );
    const spotsLeft = capacity - already_booked - takenResult.rows[0].taken;

    if (seats > spotsLeft) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: spotsLeft === 0 ? "Sorry, this event is fully booked" : `Only ${spotsLeft} spots left`,
      });
    }

    await client.query(
      `INSERT INTO bookings (user_id, event_id, seats) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, event_id) DO UPDATE SET seats = EXCLUDED.seats`,
      [req.user.id, eventId, seats]
    );

    await client.query("COMMIT");
    res.status(201).json({ eventId, seats });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Could not save booking" });
  } finally {
    client.release();
  }
});

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
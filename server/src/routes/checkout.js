import { randomUUID } from "node:crypto";
import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getStripe, siteOrigin } from "../payments/stripe.js";

const router = Router();
router.use(requireAuth);
router.post("/", async (req, res) => {
  // Cookie authentication alone is insufficient protection against cross-site POSTs.
  const origin = siteOrigin();
  if (req.get("origin") !== origin) return res.status(403).json({ error: "Invalid origin" });
  const { eventId, seats } = req.body ?? {};
  if (!Number.isSafeInteger(eventId) || eventId < 1 || !Number.isSafeInteger(seats) || seats < 1 || seats > 20) {
    return res.status(400).json({ error: "Choose an event and 1–20 spots" });
  }
  const stripe = getStripe();
  const client = await pool.connect();
  const orderId = randomUUID();
  let event;
  try {
    await client.query("BEGIN");
    const result = await client.query("SELECT * FROM events WHERE id = $1 FOR UPDATE", [eventId]);
    event = result.rows[0];
    if (!event || event.price <= 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Paid event unavailable" });
    }
    // Pending orders hold capacity until Stripe confirms payment or expiry.
    // Never release holds using a local clock: a delayed webhook could represent a paid seat.
    const used = await client.query(`SELECT
      (SELECT COALESCE(SUM(seats),0) FROM bookings WHERE event_id=$1) +
      (SELECT COALESCE(SUM(i.quantity),0) FROM order_items i JOIN orders o ON o.id=i.order_id
       WHERE i.event_id=$1 AND o.status IN ('pending','paid')) AS seats`, [eventId]);
    if (seats > event.capacity - event.already_booked - Number(used.rows[0].seats)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Not enough spots available. Refresh and try again." });
    }
    const amount = event.price * 100;
    if (!Number.isSafeInteger(amount * seats) || amount * seats > 99999999) throw new Error("Invalid event price");
    await client.query("INSERT INTO orders(id,user_id,total_amount) VALUES($1,$2,$3)", [orderId,req.user.id,amount*seats]);
    await client.query("INSERT INTO order_items(order_id,event_id,title,quantity,unit_amount) VALUES($1,$2,$3,$4,$5)",
      [orderId,eventId,event.title,seats,amount]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment", payment_method_types: ["card"],
      client_reference_id: orderId, metadata: { orderId },
      customer_email: req.user.email,
      line_items: [{ price_data: { currency: "aed", unit_amount: event.price * 100,
        product_data: { name: event.title } }, quantity: seats }],
      expires_at: Math.floor(Date.now()/1000) + 1800,
      success_url: `${origin}/?checkout=success&order=${orderId}`,
      cancel_url: `${origin}/?checkout=cancelled&order=${orderId}#events`,
    }, { idempotencyKey: `checkout-${orderId}` });
    await pool.query("UPDATE orders SET stripe_session_id=$1 WHERE id=$2", [session.id,orderId]);
    res.status(201).json({ url: session.url, orderId });
  } catch (error) {
    // A network error may mean Stripe created a session. Preserve its seat hold;
    // its signed expiry/payment webhook can still reconcile via metadata.orderId.
    if (error.type === "StripeInvalidRequestError" || error.type === "StripeAuthenticationError") {
      await pool.query("UPDATE orders SET status='failed' WHERE id=$1 AND status='pending'", [orderId]);
    }
    console.error("Checkout session creation failed", { orderId, type: error.type });
    res.status(502).json({ error: "Checkout could not start. Please contact us before retrying.", orderId });
  }
});
export default router;

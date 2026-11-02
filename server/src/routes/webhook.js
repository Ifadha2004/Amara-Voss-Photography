import { pool } from "../db.js";
import { getStripe } from "../payments/stripe.js";
import { matchesOrder } from "../payments/validation.js";

export async function stripeWebhook(req,res) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return res.sendStatus(503);
  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body,req.get("stripe-signature"),process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }
  const supported = ["checkout.session.completed", "checkout.session.expired"];
  if (!supported.includes(event.type) || event.livemode !== false) return res.json({ received: true });
  const session = event.data.object;
  const orderId = session.metadata?.orderId;
  if (!/^[0-9a-f-]{36}$/i.test(orderId ?? "")) return res.json({ received: true });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE", [orderId]);
    const order = result.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      return res.status(500).json({ error: "Order unavailable; retry delivery" });
    }
    if (!matchesOrder(session,order)) throw new Error("Stripe session does not match order");
    if (event.type === "checkout.session.completed" && session.payment_status === "paid") {
      // Row lock + pending predicate make duplicate deliveries harmless.
      // A redirect, lookup, or browser request never executes this statement.
      await client.query(`UPDATE orders SET status='paid',paid_at=now(),stripe_session_id=$1
        WHERE id=$2 AND status='pending'`, [session.id,orderId]);
    } else if (event.type === "checkout.session.expired") {
      await client.query(`UPDATE orders SET status='expired',stripe_session_id=$1
        WHERE id=$2 AND status='pending'`, [session.id,orderId]);
    }
    await client.query("COMMIT");
    res.json({ received: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Webhook processing failed", { orderId, message: error.message });
    res.status(500).json({ error: "Webhook processing failed; retry delivery" });
  } finally {
    client.release();
  }
}

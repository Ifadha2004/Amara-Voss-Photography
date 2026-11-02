import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import Stripe from "stripe";
import { pool } from "../src/db.js";
import { stripeWebhook } from "../src/routes/webhook.js";
import { matchesOrder } from "../src/payments/validation.js";

process.env.STRIPE_SECRET_KEY = "sk_test_unit_test";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_unit_test";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const db = new PGlite();
const id = "11111111-1111-4111-8111-111111111111";
const session = { id: "cs_test_example", livemode: false, mode: "payment",
  client_reference_id: id, metadata: { orderId: id }, currency: "aed",
  amount_total: 50000, payment_status: "paid" };
const order = { id, currency: "aed", total_amount: 50000, stripe_session_id: session.id };

before(async () => {
  await db.exec('CREATE TABLE "user" (id TEXT PRIMARY KEY);');
  await db.exec(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));
  // Real PostgreSQL engine in-process: no developer credentials or external DB.
  pool.connect = async () => ({ query: async (sql,args) => {
    const result = await db.query(sql,args);
    return { ...result, rowCount: result.affectedRows ?? result.rows.length };
  }, release() {} });
  await db.query('INSERT INTO "user" VALUES ($1)', ["owner"]);
  await db.query("INSERT INTO orders(id,user_id,total_amount,stripe_session_id) VALUES($1,$2,$3,$4)",
    [id,"owner",50000,session.id]);
});
after(async () => { await db.close(); await pool.end(); });

async function deliver(type, data = session, valid = true) {
  const body = Buffer.from(JSON.stringify({ id: "evt_test", type, livemode: false, data: { object: data } }));
  const signature = stripe.webhooks.generateTestHeaderString({ payload: body.toString(), secret: valid ? process.env.STRIPE_WEBHOOK_SECRET : "wrong" });
  const req = { body, get: () => signature };
  const res = { code: 200, status(n) { this.code=n; return this; }, json(value) { this.body=value; return this; }, sendStatus(n) { this.code=n; return this; } };
  await stripeWebhook(req,res);
  return res;
}
const status = async () => (await db.query("SELECT status,paid_at FROM orders WHERE id=$1",[id])).rows[0];

test("snapshot validation rejects price, currency, reference, session, and live-mode mismatches", () => {
  assert.equal(matchesOrder(session,order),true);
  for (const change of [{ amount_total:1 }, { currency:"usd" }, { client_reference_id:"other" },
    { metadata:{} }, { id:"other" }, { livemode:true }, { mode:"subscription" }]) {
    assert.equal(matchesOrder({ ...session,...change },order),false);
  }
});
test("forged signature is rejected without changing pending order", async () => {
  assert.equal((await deliver("checkout.session.completed",session,false)).code,400);
  assert.equal((await status()).status,"pending");
});
test("signed but unpaid session cannot mark an order paid", async () => {
  assert.equal((await deliver("checkout.session.completed",{ ...session,payment_status:"unpaid" })).code,200);
  assert.equal((await status()).status,"pending");
});
test("signed wrong total is rejected and rolled back", async () => {
  assert.equal((await deliver("checkout.session.completed",{ ...session,amount_total:1 })).code,500);
  assert.equal((await status()).status,"pending");
});
test("verified payment updates order once; duplicate and late expiry preserve paid state", async () => {
  assert.equal((await deliver("checkout.session.completed")).code,200);
  const first = await status();
  assert.equal(first.status,"paid");
  assert.ok(first.paid_at);
  assert.equal((await deliver("checkout.session.completed")).code,200);
  assert.deepEqual(await status(),first);
  assert.equal((await deliver("checkout.session.expired")).code,200);
  assert.deepEqual(await status(),first);
});
test("signed expiry releases a pending order", async () => {
  await db.query("UPDATE orders SET status='pending',paid_at=NULL WHERE id=$1",[id]);
  assert.equal((await deliver("checkout.session.expired",{ ...session,payment_status:"unpaid" })).code,200);
  assert.equal((await status()).status,"expired");
});
test("migration can be applied repeatedly", async () => {
  const migration = await readFile(new URL("../db/payments.sql", import.meta.url),"utf8");
  await db.exec(migration);
  await db.exec(migration);
});

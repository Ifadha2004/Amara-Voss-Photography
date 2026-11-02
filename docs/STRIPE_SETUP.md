# Stripe test checkout: setup and assessment guide

## What changed

Event purchases now use **Book and pay**. The browser sends only `eventId` and `seats`.
Express uses the signed-in Better Auth user, reads the event's AED price from Postgres,
checks capacity under a row lock, and stores a pending order plus a price snapshot.
Stripe hosts the card form. Only the verified webhook can set `orders.status = 'paid'`.
The return page reads the authenticated order endpoint, polling every two seconds up
to 15 times, and offers a manual retry. The URL itself never proves payment.

Existing free reservations remain visible and removable. New free reservations are
blocked (the old POST endpoint returns 410). New paid orders are shown on their
confirmation page and stored in orders; they cannot be cancelled with the old
booking-delete endpoint. Refunds and a full order-history screen are outside this change.

## 1. Install and migrate

From the repository root:

```bash
cd server
npm ci
cp .env.example .env
```

If `.env` already exists, edit it instead of overwriting it. Preserve DATABASE_URL,
BETTER_AUTH_SECRET and BETTER_AUTH_URL. Add:

```dotenv
APP_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_actual_test_secret
STRIPE_WEBHOOK_SECRET=whsec_from_the_cli_listener
```

Use a Stripe test environment/sandbox and its secret API key. Never put secrets in
React, VITE_ variables, GitHub, screenshots or chat. Hosted Checkout doesn't require
a publishable key in this implementation. Live secret keys are deliberately rejected.

Apply the additive migration to your existing database:

```bash
npm run db:payments
npm test
npm run dev
```

This is plain SQL with `pg`, not Prisma/Drizzle: `db:payments` is the schema-push step.
It creates `orders` and `order_items` (the SQL equivalent of the assignment's orderItems).
It requires the existing auth user and events tables. It does not seed/reset data.
For a completely new DB, create the Better Auth tables as in the original README,
then apply schema.sql and seed. Prefer a separate test DB from any real customer data.

## 2. Start the frontend

In another terminal, from the repository root:

```bash
cd client
npm ci
npm run dev
```

Keep APP_URL and BETTER_AUTH_URL at http://localhost:5173 for local work.
Visit that URL and sign in. Start with an event that has available spots.

## 3. Forward real test-mode webhooks

Install Stripe CLI using the official instructions: https://docs.stripe.com/stripe-cli

```bash
stripe login
stripe listen --events checkout.session.completed,checkout.session.expired --forward-to localhost:3000/api/webhooks/stripe
```

Copy the listener's `whsec_...` secret into server/.env and restart the API.
Keep this terminal running. The listener's signing secret differs from a deployed
endpoint's signing secret. Match the CLI account/environment to the API key.
The webhook expects snapshot Checkout Session events.

## 4. Complete the assessment transaction

1. Sign in, choose a quantity, and click **Book and pay**.
2. Verify the Stripe page shows the correct event, quantity and AED total.
3. Pay with `4242 4242 4242 4242`, a future expiry and any CVC. Fill required fields.
4. The CLI should show `checkout.session.completed` with an HTTP 200 response.
5. The return page must show **Payment confirmed** and **Status: paid**.
6. Show the database query below. Open the code and explain each step.

Do this through the site. `stripe trigger` fixtures do not carry your database order
metadata and cannot prove the full purchase flow. No external Stripe transaction
has been performed by the automated tests shipped with this code.

```sql
SELECT o.id, o.user_id, o.status, o.currency, o.total_amount,
       o.stripe_session_id, o.paid_at,
       i.event_id, i.title, i.quantity, i.unit_amount
FROM orders o
JOIN order_items i ON i.order_id = o.id
ORDER BY o.created_at DESC;
```

50000 means AED 500.00. Item titles and unit amounts are snapshots: later event
price changes must not rewrite a customer's purchase history.

## 5. Failure checks worth demonstrating

- Signed out: the API rejects checkout with 401 even if the UI is bypassed.
- Browser price tampering: extra price fields are ignored; DB prices are authoritative.
- Another user's order ID: lookup returns 404; order ownership is checked on the server.
- Forged webhook signature: 400 and the order remains pending.
- Visiting `?checkout=success&order=...` manually: cannot mark an order paid.
- Resend the same completed event from Stripe: order stays paid with the same paid_at.
- Cancel Stripe checkout: the return page says no payment is confirmed. Stripe expiry
  releases the hold; cancellation redirect alone does not release seats or alter payment.
- Two checkouts for the last seat: event-row locking lets only one reserve it.

## 6. Deploy on the existing Render + Vercel setup

Deploy this branch normally. In Render's server environment configure:

```dotenv
APP_URL=https://amara-voss-photography.vercel.app
BETTER_AUTH_URL=https://amara-voss-photography.vercel.app
STRIPE_SECRET_KEY=sk_test_your_actual_test_secret
STRIPE_WEBHOOK_SECRET=whsec_from_your_deployed_endpoint
```

Run `npm run db:payments` against the deployed DATABASE_URL before serving the new
routes. Install production dependencies with npm ci (or npm ci --omit=dev).

In Stripe's **test environment**, create a snapshot webhook endpoint:

`https://amara-voss-photography.onrender.com/api/webhooks/stripe`

Select `checkout.session.completed` and `checkout.session.expired`. Copy its signing
secret to Render and redeploy/restart. Pointing directly at Render avoids the frontend
proxy for webhook requests. The existing Vercel /api rewrite still handles browser API
calls; return URLs use root query parameters, so no SPA path rewrite is needed.

Repeat the actual card transaction on the deployed site. Hosted production URLs still
use **test keys** for this assessment. Do not switch to live-money keys. Warm the free
Render service before presenting because it can sleep. Stripe retries failed delivery;
check its event delivery log if the confirmation remains pending.

## Files to explain

| File | Responsibility |
|---|---|
| server/db/payments.sql | Orders, item snapshots, constraints and indexes |
| server/src/middleware/requireAuth.js | Existing cookie-session login check |
| server/src/routes/checkout.js | Origin/input checks, capacity lock, DB price, session creation |
| server/src/routes/webhook.js | Raw-body signature check, order lock, sole paid writer |
| server/src/payments/validation.js | Match amount, currency, order reference, session and test mode |
| server/src/routes/orders.js | Owner-only, read-only order lookup with no-store caching |
| client/src/components/Events.jsx | Calls checkout and redirects to Stripe |
| client/src/components/CheckoutStatus.jsx | Polls DB status; never writes paid |

The raw webhook route is registered BEFORE express.json(). Parsing JSON first changes
the signed bytes and breaks signature verification. Payment method is card only, so
asynchronous payment methods are not enabled by this implementation.

## Capacity and recovery limits

Pending and paid order items count against capacity, alongside legacy bookings and
offline seats. Pending orders have a 30-minute Stripe session. Capacity is released
only when its signed expiry arrives, not by a local timer; this protects against late
payment webhooks. Do not manually release an active/possibly paid Stripe session.

If Stripe session creation has an ambiguous network failure, or Stripe succeeds but
the session-ID DB update fails, the server conservatively retains the hold. Metadata
lets later payment/expiry events reconcile it even without the session ID in the DB.
If no session was ever created, that hold needs operator investigation in Stripe
using the logged order ID. This coursework implementation does not include a scheduled
reconciliation worker. Do not retry repeatedly on a creation error; investigate first.

Seat holds are not rate limited here; an authenticated user could hold many seats via
multiple checkout requests. Add per-user limits/rate limiting before a public commercial
launch. Refunds, receipts, order emails and a customer order-history screen are not
implemented. Existing event dates are fictional seed content.

## Verification performed

- Frontend ESLint and production build.
- Seven automated tests using an in-process PostgreSQL engine (PGlite): migration,
  real Stripe SDK signature generation/verification, unpaid and mismatched payloads,
  idempotent completion and expiry. These do not simulate multiple DB connections.
- Real PostgreSQL concurrent checkouts, live Stripe API calls, deployment, and the
  full card transaction still require your environment and must be checked manually.

Official references: https://docs.stripe.com/checkout/fulfillment and
https://docs.stripe.com/webhooks

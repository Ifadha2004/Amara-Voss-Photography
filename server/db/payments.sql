-- Apply once to an existing database; safe to run again.


-- Prices are immutable snapshots in minor units (100 fils = AED 1).
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'failed')),
  currency TEXT NOT NULL DEFAULT 'aed' CHECK (currency = 'aed'),
  total_amount INTEGER NOT NULL CHECK (total_amount > 0),
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  event_id INTEGER NOT NULL REFERENCES events(id),
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  unit_amount INTEGER NOT NULL CHECK (unit_amount > 0),
  UNIQUE(order_id, event_id)
);
CREATE INDEX IF NOT EXISTS order_items_event_idx ON order_items(event_id);

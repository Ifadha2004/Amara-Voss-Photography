-- Photos shown in the portfolio gallery
CREATE TABLE IF NOT EXISTS photos (
  id        INTEGER PRIMARY KEY,
  title     TEXT NOT NULL,
  category  TEXT NOT NULL,
  src       TEXT NOT NULL,   -- image path, e.g. /images/gallery-01.jpg
  alt       TEXT NOT NULL    -- description for screen readers
);

-- Events (photo walks, workshops) people can book
CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL,
  weekday      TEXT NOT NULL,
  day          INTEGER NOT NULL,
  month        TEXT NOT NULL,
  time         TEXT NOT NULL,
  duration     TEXT NOT NULL,
  location     TEXT NOT NULL,
  price        INTEGER NOT NULL CHECK (price >= 0),     -- AED per spot
  capacity     INTEGER NOT NULL CHECK (capacity > 0),   -- total spots
  already_booked INTEGER NOT NULL DEFAULT 0 CHECK (already_booked >= 0),  -- seats taken offline
  image        TEXT NOT NULL,
  description  TEXT NOT NULL
);

-- Which photos each user has saved
CREATE TABLE IF NOT EXISTS favourites (
  user_id    TEXT    NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  photo_id   INTEGER NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, photo_id)          -- a photo can only be saved once per user
);

-- Seats a user has reserved at an event (one booking per user per event)
CREATE TABLE IF NOT EXISTS bookings (
  id         SERIAL PRIMARY KEY,
  user_id    TEXT    NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  event_id   INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  seats      INTEGER NOT NULL CHECK (seats > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_id)
);

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

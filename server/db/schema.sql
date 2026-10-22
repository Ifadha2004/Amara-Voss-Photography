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
  image        TEXT NOT NULL,
  description  TEXT NOT NULL
);
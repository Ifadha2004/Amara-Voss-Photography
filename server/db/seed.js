import { pool } from "../src/db.js";
import { photos } from "./data/photos.js";
import { events } from "./data/events.js";

const client = await pool.connect();

try {
  // One transaction: either everything is saved, or nothing is.
  await client.query("BEGIN");

  for (const p of photos) {
    // $1, $2... are placeholders: values are sent separately from the SQL,
    // which protects against SQL injection.
    // ON CONFLICT makes the script safe to run again: it updates the row if the id exists.
    await client.query(
      `INSERT INTO photos (id, title, category, src, alt)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         category = EXCLUDED.category,
         src = EXCLUDED.src,
         alt = EXCLUDED.alt`,
      [p.id, p.title, p.category, p.src, p.alt]
    );
  }

  for (const e of events) {
    await client.query(
      `INSERT INTO events
         (id, title, type, weekday, day, month, time, duration, location,
          price, capacity, already_booked, image, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title, type = EXCLUDED.type, weekday = EXCLUDED.weekday,
         day = EXCLUDED.day, month = EXCLUDED.month, time = EXCLUDED.time,
         duration = EXCLUDED.duration, location = EXCLUDED.location,
         price = EXCLUDED.price, capacity = EXCLUDED.capacity,
         already_booked = EXCLUDED.already_booked,
         image = EXCLUDED.image, description = EXCLUDED.description`,
      [e.id, e.title, e.type, e.weekday, e.day, e.month, e.time, e.duration,
       e.location, e.price, e.capacity, e.booked, e.image, e.description]
    );
  }

  await client.query("COMMIT");
  console.log(`Seeded ${photos.length} photos and ${events.length} events`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Seed failed, nothing was saved:", error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
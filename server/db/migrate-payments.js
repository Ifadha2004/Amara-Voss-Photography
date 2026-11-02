import { readFile } from "node:fs/promises";
import { pool } from "../src/db.js";
try {
  await pool.query(await readFile(new URL("./payments.sql", import.meta.url), "utf8"));
  console.log("Payment tables ready");
} finally {
  await pool.end();
}

import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/photos          -> all photos
// GET /api/photos?category=Portrait -> only that category
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const result =
      category && category !== "All"
        ? await pool.query(
            "SELECT id, title, category, src, alt FROM photos WHERE category = $1 ORDER BY id",
            [category]
          )
        : await pool.query(
            "SELECT id, title, category, src, alt FROM photos ORDER BY id"
          );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load photos" });
  }
});

export default router;
import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);   // every route in this file needs a signed-in user

// GET /api/favourites -> [1, 4, 7]  (ids of my saved photos)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT photo_id FROM favourites WHERE user_id = $1 ORDER BY created_at",
      [req.user.id]
    );
    res.json(result.rows.map((row) => row.photo_id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load favourites" });
  }
});

// PUT /api/favourites/4 -> save photo 4
router.put("/:photoId", async (req, res) => {
  const photoId = Number(req.params.photoId);
  if (!Number.isInteger(photoId)) {
    return res.status(400).json({ error: "Invalid photo id" });
  }
  try {
    await pool.query(
      "INSERT INTO favourites (user_id, photo_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [req.user.id, photoId]
    );
    res.json({ ok: true });
  } catch (error) {
    if (error.code === "23503") {   // foreign key violation: that photo doesn't exist
      return res.status(404).json({ error: "Photo not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Could not save favourite" });
  }
});

// DELETE /api/favourites/4 -> un-save photo 4
router.delete("/:photoId", async (req, res) => {
  const photoId = Number(req.params.photoId);
  if (!Number.isInteger(photoId)) {
    return res.status(400).json({ error: "Invalid photo id" });
  }
  try {
    await pool.query(
      "DELETE FROM favourites WHERE user_id = $1 AND photo_id = $2",
      [req.user.id, photoId]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not remove favourite" });
  }
});

// DELETE /api/favourites -> clear all of mine
router.delete("/", async (req, res) => {
  try {
    await pool.query("DELETE FROM favourites WHERE user_id = $1", [req.user.id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not clear favourites" });
  }
});

export default router;
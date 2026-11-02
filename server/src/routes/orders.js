import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = Router();
router.use(requireAuth);
router.get("/:id", async (req,res) => {
  res.set("Cache-Control", "no-store");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }
  const result = await pool.query(`SELECT id,status,currency,total_amount,created_at,paid_at
    FROM orders WHERE id=$1 AND user_id=$2`, [req.params.id,req.user.id]);
  if (!result.rowCount) return res.status(404).json({ error: "Order not found" });
  const items = await pool.query("SELECT title,quantity,unit_amount FROM order_items WHERE order_id=$1", [req.params.id]);
  res.json({ ...result.rows[0], items: items.rows });
});
export default router;

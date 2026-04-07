import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "./_adminAuth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const sql = neon(process.env.DATABASE_URL!);

  // GET — list all orders with items
  if (req.method === "GET") {
    const orders = await sql`
      SELECT
        o.id, o.order_number, o.total, o.status, o.created_at,
        o.guest_email, o.shipping_address,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'name', oi.product_name,
            'qty', oi.quantity,
            'price', oi.unit_price
          ) ORDER BY oi.id
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    return res.status(200).json(orders);
  }

  // PUT — update order status
  if (req.method === "PUT") {
    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ error: "Missing id or status" });

    const VALID_STATUSES = ["processing", "shipped", "delivered", "cancelled"];
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status" });

    await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

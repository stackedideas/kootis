import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "./_adminAuth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const sql = neon(process.env.DATABASE_URL!);

  const [counts] = await sql`
    SELECT
      (SELECT COUNT(*) FROM products)::int AS total_products,
      (SELECT COUNT(*) FROM orders)::int AS total_orders,
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled') AS total_revenue
  `;

  const recentOrders = await sql`
    SELECT id, order_number, total, status, created_at, guest_email
    FROM orders
    ORDER BY created_at DESC
    LIMIT 10
  `;

  return res.status(200).json({
    totalProducts: counts.total_products,
    totalOrders: counts.total_orders,
    totalRevenue: Number(counts.total_revenue),
    recentOrders,
  });
}

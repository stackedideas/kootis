import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);

  if (req.method === "GET") {
    const { category, badge, slug, featured } = req.query;

    let query = `
      SELECT
        id, slug, name, category, price,
        sale_price, original_price,
        images[1] AS image,
        badge, discount_pct, in_stock, featured,
        created_at
      FROM products
      WHERE in_stock = true
    `;
    const params: (string | boolean)[] = [];

    if (slug) {
      params.push(slug as string);
      query += ` AND slug = $${params.length}`;
    }
    if (category) {
      params.push(category as string);
      query += ` AND category ILIKE $${params.length}`;
    }
    if (badge) {
      params.push(badge as string);
      query += ` AND badge = $${params.length}`;
    }
    if (featured === "true") {
      query += ` AND featured = true`;
    }

    query += ` ORDER BY created_at DESC`;

    const rows = await sql(query, params);
    return res.status(200).json(rows);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

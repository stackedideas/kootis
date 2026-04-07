import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "./_adminAuth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const sql = neon(process.env.DATABASE_URL!);

  // GET — list all products (including out-of-stock)
  if (req.method === "GET") {
    const rows = await sql`
      SELECT id, slug, name, category, price, sale_price, original_price,
             images, badge, discount_pct, in_stock, featured,
             sizes, colors, product_details, shipping_returns, care_instructions,
             created_at
      FROM products
      ORDER BY created_at DESC
    `;
    return res.status(200).json(rows);
  }

  // POST — create product
  if (req.method === "POST") {
    const { name, slug, category, price, sale_price, original_price, badge, discount_pct, in_stock, featured, image, sizes, colors, product_details, shipping_returns, care_instructions } = req.body;

    const [row] = await sql`
      INSERT INTO products (name, slug, category, price, sale_price, original_price, badge, discount_pct, in_stock, featured, images, sizes, colors, product_details, shipping_returns, care_instructions)
      VALUES (
        ${name}, ${slug}, ${category}, ${price},
        ${sale_price ?? null}, ${original_price ?? null},
        ${badge ?? null}, ${discount_pct ?? null},
        ${in_stock ?? true}, ${featured ?? false},
        ${image ? [image] : []},
        ${sizes ?? []}, ${JSON.stringify(colors ?? [])},
        ${product_details ?? null}, ${shipping_returns ?? null}, ${care_instructions ?? null}
      )
      RETURNING id
    `;
    return res.status(201).json({ id: row.id });
  }

  // PUT — update product (full edit or stock toggle)
  if (req.method === "PUT") {
    const { id, ...fields } = req.body;
    if (!id) return res.status(400).json({ error: "Missing id" });

    // Build dynamic update — only set fields that were sent
    const updates: Record<string, unknown> = {};
    const allowed = ["name", "slug", "category", "price", "sale_price", "original_price", "badge", "discount_pct", "in_stock", "featured", "image", "sizes", "colors", "product_details", "shipping_returns", "care_instructions"];
    for (const key of allowed) {
      if (key in fields) updates[key] = fields[key];
    }

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No fields to update" });

    // Build parameterised query manually
    const setClauses: string[] = [];
    const values: unknown[] = [];

    for (const [key, val] of Object.entries(updates)) {
      values.push(key === "image" ? [val] : val); // wrap image in array for images column
      let colName = key === "image" ? "images" : key;
      if (key === "colors") values[values.length - 1] = JSON.stringify(val);
      setClauses.push(`${colName} = $${values.length}`);
    }

    values.push(id);
    const query = `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${values.length}`;
    await sql(query, values);

    return res.status(200).json({ ok: true });
  }

  // DELETE — remove product
  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });
    await sql`DELETE FROM products WHERE id = ${id as string}`;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

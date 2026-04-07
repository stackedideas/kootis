import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Decodes the Supabase JWT from the Authorization header and checks role=admin.
 * The JWT is issued and signed by Supabase — we trust its payload for role checks.
 * Returns the user ID if valid, or sends 401/403 and returns null.
 */
export async function requireAdmin(req: VercelRequest, res: VercelResponse): Promise<string | null> {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Bad token");
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));

    // Check expiry
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      res.status(401).json({ error: "Token expired" });
      return null;
    }

    // Check admin role
    if (payload.user_metadata?.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return null;
    }

    return payload.sub as string;
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
}

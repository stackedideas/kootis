import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Validates the Supabase JWT from Authorization header and checks role=admin.
 * Returns the user ID if valid, or sends 401/403 and returns null.
 */
export async function requireAdmin(req: VercelRequest, res: VercelResponse): Promise<string | null> {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
  if (data.user.user_metadata?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }

  return data.user.id;
}

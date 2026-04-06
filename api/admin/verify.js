// GET /api/admin/verify?token=xxx
// Validates magic link token and sets session cookie
import { getDb, handleCors } from '../_db.js';

const SITE_URL = 'https://gioruiz.com';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  const slug = process.env.VITE_ADMIN_SLUG || 'admin';

  if (!token) {
    return res.redirect(302, `${SITE_URL}/${slug}?error=missing_token`);
  }

  try {
    const sql = getDb();

    const [session] = await sql`
      SELECT id, email, expires_at FROM admin_sessions
      WHERE token = ${token}
    `;

    if (!session) {
      return res.redirect(302, `${SITE_URL}/${slug}?error=invalid_token`);
    }

    if (new Date(session.expires_at) < new Date()) {
      await sql`DELETE FROM admin_sessions WHERE id = ${session.id}`;
      return res.redirect(302, `${SITE_URL}/${slug}?error=expired_token`);
    }

    // Extend session to 7 days from now
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await sql`
      UPDATE admin_sessions SET expires_at = ${newExpiry.toISOString()}
      WHERE id = ${session.id}
    `;

    // Set an httpOnly cookie with the token
    const cookieOptions = [
      `admin_token=${token}`,
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      `Max-Age=${7 * 24 * 60 * 60}`,
      'Path=/',
    ].join('; ');

    res.setHeader('Set-Cookie', cookieOptions);
    return res.redirect(302, `${SITE_URL}/${slug}/dashboard`);
  } catch (error) {
    console.error('Admin verify error:', error.message);
    return res.redirect(302, `${SITE_URL}/${slug}?error=server_error`);
  }
}

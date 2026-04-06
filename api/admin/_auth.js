// Shared admin auth middleware
// Validates the admin_token cookie against the database
import { getDb } from '../_db.js';

export async function requireAdminAuth(req, res) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const token = cookies['admin_token'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  try {
    const sql = getDb();
    const [session] = await sql`
      SELECT id, email, expires_at FROM admin_sessions
      WHERE token = ${token}
    `;

    if (!session || new Date(session.expires_at) < new Date()) {
      res.status(401).json({ error: 'Session expired. Please log in again.' });
      return null;
    }

    return session; // authenticated
  } catch (error) {
    console.error('Auth check error:', error.message);
    res.status(500).json({ error: 'Authentication error' });
    return null;
  }
}

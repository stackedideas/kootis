// GET /api/booking/services
// Returns list of active booking services
import { getDb, handleCors } from '../_db.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();
    const services = await sql`
      SELECT id, name, slug, duration_minutes, description
      FROM services
      WHERE is_active = true
      ORDER BY id ASC
    `;
    return res.status(200).json({ services });
  } catch (error) {
    console.error('Services API error:', error.message);
    return res.status(500).json({ error: 'Failed to load services' });
  }
}

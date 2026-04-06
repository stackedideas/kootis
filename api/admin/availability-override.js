// POST /api/admin/availability-override
// Add or remove a date-specific availability override (auth required)
// To block a day: { date, isAvailable: false, reason }
// To add special hours: { date, isAvailable: true, startTime, endTime }
// To remove an override: { date, remove: true }
import { getDb, handleCors } from '../_db.js';
import { requireAdminAuth } from './_auth.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAdminAuth(req, res);
  if (!session) return;

  const { date, isAvailable, startTime, endTime, reason, remove } = req.body || {};

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Valid date (YYYY-MM-DD) is required' });
  }

  try {
    const sql = getDb();

    if (remove) {
      await sql`DELETE FROM availability_overrides WHERE override_date = ${date}`;
      return res.status(200).json({ success: true, message: 'Override removed' });
    }

    // Upsert the override
    const [result] = await sql`
      INSERT INTO availability_overrides (override_date, start_time, end_time, is_available, reason)
      VALUES (${date}, ${startTime || null}, ${endTime || null}, ${isAvailable !== false}, ${reason || null})
      ON CONFLICT (override_date) DO UPDATE
        SET start_time   = EXCLUDED.start_time,
            end_time     = EXCLUDED.end_time,
            is_available = EXCLUDED.is_available,
            reason       = EXCLUDED.reason
      RETURNING *
    `;

    return res.status(200).json({ success: true, override: result });
  } catch (error) {
    console.error('Override error:', error.message);
    return res.status(500).json({ error: 'Failed to save override' });
  }
}

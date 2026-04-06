// GET  /api/admin/availability — get weekly rules + upcoming overrides
// PUT  /api/admin/availability — update a weekly rule (auth required)
import { getDb, handleCors } from '../_db.js';
import { requireAdminAuth } from './_auth.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const session = await requireAdminAuth(req, res);
  if (!session) return;

  const sql = getDb();

  if (req.method === 'GET') {
    try {
      const [rules, overrides] = await Promise.all([
        sql`SELECT * FROM availability_rules ORDER BY day_of_week ASC`,
        sql`
          SELECT * FROM availability_overrides
          WHERE override_date >= CURRENT_DATE
          ORDER BY override_date ASC
          LIMIT 60
        `,
      ]);
      return res.status(200).json({ rules, overrides });
    } catch (error) {
      console.error('Availability GET error:', error.message);
      return res.status(500).json({ error: 'Failed to load availability' });
    }
  }

  if (req.method === 'PUT') {
    const { dayOfWeek, startTime, endTime, isActive } = req.body || {};

    if (dayOfWeek === undefined) {
      return res.status(400).json({ error: 'dayOfWeek is required' });
    }

    const timeRegex = /^\d{2}:\d{2}$/;
    if (startTime !== undefined && startTime !== null && !timeRegex.test(startTime)) {
      return res.status(400).json({ error: 'Invalid startTime format. Use HH:MM' });
    }
    if (endTime !== undefined && endTime !== null && !timeRegex.test(endTime)) {
      return res.status(400).json({ error: 'Invalid endTime format. Use HH:MM' });
    }

    try {
      const [updated] = await sql`
        UPDATE availability_rules
        SET
          start_time = COALESCE(${startTime || null}, start_time),
          end_time   = COALESCE(${endTime || null}, end_time),
          is_active  = COALESCE(${isActive !== undefined ? isActive : null}, is_active)
        WHERE day_of_week = ${parseInt(dayOfWeek, 10)}
        RETURNING *
      `;

      if (!updated) {
        return res.status(404).json({ error: 'Rule not found for that day' });
      }

      return res.status(200).json({ success: true, rule: updated });
    } catch (error) {
      console.error('Availability PUT error:', error.message);
      return res.status(500).json({ error: 'Failed to update availability' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

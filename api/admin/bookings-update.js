// PUT /api/admin/bookings-update
// Updates booking status: cancel or complete (auth required)
import { getDb, handleCors } from '../_db.js';
import { requireAdminAuth } from './_auth.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAdminAuth(req, res);
  if (!session) return;

  const { id, status } = req.body || {};

  if (!id || !status) {
    return res.status(400).json({ error: 'id and status are required' });
  }

  if (!['cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use cancelled or completed.' });
  }

  try {
    const sql = getDb();

    const [updated] = await sql`
      UPDATE bookings
      SET status = ${status}
      WHERE id = ${parseInt(id, 10)}
      RETURNING id, reference, status
    `;

    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json({ success: true, booking: updated });
  } catch (error) {
    console.error('Booking update error:', error.message);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
}

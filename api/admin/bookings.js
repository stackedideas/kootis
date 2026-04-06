// GET /api/admin/bookings?status=confirmed&from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns bookings list (auth required)
import { getDb, handleCors } from '../_db.js';
import { requireAdminAuth } from './_auth.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAdminAuth(req, res);
  if (!session) return;

  const { status, from, to } = req.query;

  try {
    const sql = getDb();

    const bookings = await sql`
      SELECT
        b.id, b.reference, b.client_first_name, b.client_last_name,
        b.client_email, b.client_phone, b.booking_date, b.start_time,
        b.end_time, b.meeting_type, b.status, b.notes, b.created_at,
        s.name AS service_name, s.duration_minutes
      FROM bookings b
      JOIN services s ON s.id = b.service_id
      WHERE 1=1
        ${status ? sql`AND b.status = ${status}` : sql``}
        ${from ? sql`AND b.booking_date >= ${from}` : sql``}
        ${to ? sql`AND b.booking_date <= ${to}` : sql``}
      ORDER BY b.booking_date ASC, b.start_time ASC
    `;

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error('Admin bookings error:', error.message);
    return res.status(500).json({ error: 'Failed to load bookings' });
  }
}

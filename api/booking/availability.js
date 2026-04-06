// GET /api/booking/availability?date=YYYY-MM-DD&serviceId=1
// Returns available time slots for a given date and service
import { getDb, handleCors, isRateLimited } from '../_db.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  if (isRateLimited(ip, 60, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { date, serviceId } = req.query;

  if (!date || !serviceId) {
    return res.status(400).json({ error: 'date and serviceId are required' });
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  // Don't allow past dates
  const requested = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (requested < today) {
    return res.status(400).json({ error: 'Cannot book past dates' });
  }

  try {
    const sql = getDb();

    // Get the service duration
    const [service] = await sql`
      SELECT duration_minutes FROM services
      WHERE id = ${parseInt(serviceId, 10)} AND is_active = true
    `;
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // day_of_week: 0=Sun, 1=Mon ... 6=Sat (matches JS getDay())
    const dayOfWeek = requested.getDay();

    // Check for a date-specific override first
    const [override] = await sql`
      SELECT is_available, start_time, end_time
      FROM availability_overrides
      WHERE override_date = ${date}
    `;

    let dayStart = null;
    let dayEnd = null;

    if (override) {
      if (!override.is_available) {
        // Entire day is blocked
        return res.status(200).json({ slots: [] });
      }
      dayStart = override.start_time;
      dayEnd = override.end_time;
    } else {
      // Fall back to weekly rule
      const [rule] = await sql`
        SELECT start_time, end_time FROM availability_rules
        WHERE day_of_week = ${dayOfWeek} AND is_active = true
      `;
      if (!rule) {
        // No rule for this day = unavailable
        return res.status(200).json({ slots: [] });
      }
      dayStart = rule.start_time;
      dayEnd = rule.end_time;
    }

    // Get already-booked slots for this date
    const booked = await sql`
      SELECT start_time, end_time FROM bookings
      WHERE booking_date = ${date}
        AND status = 'confirmed'
    `;

    // Generate all possible slots
    const duration = service.duration_minutes;
    const slots = [];

    // Parse HH:MM time strings into minutes-since-midnight
    const toMinutes = (t) => {
      const [h, m] = t.slice(0, 5).split(':').map(Number);
      return h * 60 + m;
    };
    const toTimeStr = (mins) => {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const startMins = toMinutes(dayStart);
    const endMins = toMinutes(dayEnd);
    const bookedRanges = booked.map((b) => ({
      start: toMinutes(b.start_time),
      end: toMinutes(b.end_time),
    }));

    for (let t = startMins; t + duration <= endMins; t += duration) {
      const slotEnd = t + duration;
      // Check for conflict with any booked slot
      const conflict = bookedRanges.some(
        (b) => t < b.end && slotEnd > b.start
      );
      if (!conflict) {
        slots.push({
          start: toTimeStr(t),
          end: toTimeStr(slotEnd),
          label: formatSlotLabel(toTimeStr(t), toTimeStr(slotEnd)),
        });
      }
    }

    return res.status(200).json({ slots, date });
  } catch (error) {
    console.error('Availability API error:', error.message);
    return res.status(500).json({ error: 'Failed to load availability' });
  }
}

function formatSlotLabel(start, end) {
  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

// POST /api/booking/create
import { Resend } from 'resend';
import { getDb, handleCors, isRateLimited } from '../_db.js';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.SITE_URL || '';
const BUSINESS_NAME = process.env.BUSINESS_NAME || process.env.VITE_BUSINESS_NAME || 'Business';
const BUSINESS_TAGLINE = process.env.BUSINESS_TAGLINE || '';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim();
const SEND_FROM_EMAIL = (process.env.SEND_FROM_EMAIL || ADMIN_EMAIL).trim();
const BUSINESS_PHONE = process.env.BUSINESS_PHONE || process.env.VITE_BUSINESS_PHONE || '';

function generateReference() {
  return 'REF-' + uuidv4().replace(/-/g, '').slice(0, 6).toUpperCase();
}

function escapeHtml(str) {
  return validator.escape(String(str || ''));
}

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
}

// ── HubSpot sync (graceful degradation) ─────────────────────────────────────

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

async function hubspotFetch(url, options, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function upsertHubSpotContact({ firstName, lastName, email, phone }) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const searchRes = await hubspotFetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['id'],
      limit: 1,
    }),
  });

  const searchData = await searchRes.json();
  const existing = searchData?.results?.[0];
  const properties = { firstname: firstName, lastname: lastName, email, ...(phone ? { phone } : {}) };

  if (existing) {
    await hubspotFetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${existing.id}`, {
      method: 'PATCH', headers, body: JSON.stringify({ properties }),
    });
    return existing.id;
  } else {
    const createRes = await hubspotFetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
      method: 'POST', headers, body: JSON.stringify({ properties }),
    });
    return (await createRes.json())?.id;
  }
}

async function createHubSpotNote(contactId, { serviceName, bookingDate, startTime, endTime, meetingType, notes, reference }) {
  const meetingLabel = meetingType === 'phone' ? 'Phone Call' : 'In Person';
  const noteBody = [
    `Appointment Booked — ${serviceName}`,
    `Reference: ${reference}`,
    `Date: ${formatDisplayDate(bookingDate)}`,
    `Time: ${formatTime(startTime)} – ${formatTime(endTime)}`,
    `Meeting Type: ${meetingLabel}`,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean).join('\n');

  const noteRes = await hubspotFetch(`${HUBSPOT_API_BASE}/crm/v3/objects/notes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: { hs_note_body: noteBody, hs_timestamp: Date.now().toString() },
      associations: [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }],
    }),
  });
  if (!noteRes.ok) console.warn('HubSpot note creation failed:', await noteRes.text());
}

async function syncToHubSpot(bookingData) {
  if (!process.env.HUBSPOT_ACCESS_TOKEN) return;
  try {
    const contactId = await upsertHubSpotContact(bookingData);
    if (contactId) await createHubSpotNote(contactId, bookingData);
  } catch (err) {
    console.error('HubSpot sync failed:', err.message || err);
  }
}

// ── Email helpers ─────────────────────────────────────────────────────────────

async function sendClientConfirmation({ firstName, email, serviceName, bookingDate, startTime, endTime, meetingType, reference }) {
  const meetingLabel = meetingType === 'phone' ? 'Phone Call' : 'In Person';
  const displayDate = formatDisplayDate(bookingDate);
  const displayTime = `${formatTime(startTime)} – ${formatTime(endTime)}`;

  const plainText = [
    `Hi ${firstName},`,
    ``,
    `Your consultation with ${BUSINESS_NAME} is confirmed.`,
    ``,
    `SERVICE: ${serviceName}`,
    `DATE: ${displayDate}`,
    `TIME: ${displayTime}`,
    `FORMAT: ${meetingLabel}`,
    `REFERENCE: ${reference}`,
    ``,
    `Need to reschedule or have questions? Reply to this email or contact us at ${ADMIN_EMAIL}.`,
    ``,
    `${BUSINESS_NAME}`,
    BUSINESS_TAGLINE,
  ].filter(l => l !== undefined).join('\n');

  await resend.emails.send({
    from: `${BUSINESS_NAME} <${SEND_FROM_EMAIL}>`,
    to: email,
    replyTo: ADMIN_EMAIL,
    subject: `Consultation confirmed — ${displayDate}`,
    text: plainText,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #333;">
        <div style="background: #1a1a2e; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <p style="color: #fff; margin: 0; font-size: 20px; font-weight: bold;">${escapeHtml(BUSINESS_NAME)}</p>
        </div>
        <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0;">
          <h1 style="font-size: 22px; margin: 0 0 8px;">You're all set, ${escapeHtml(firstName)}!</h1>
          <p style="color: #555; margin: 0 0 24px;">Your consultation has been confirmed. Here are your details:</p>

          <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">SERVICE</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(serviceName)}</td></tr>
              <tr style="border-top: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #888; font-size: 13px;">DATE</td><td style="padding: 8px 0; font-weight: 600;">${displayDate}</td></tr>
              <tr style="border-top: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #888; font-size: 13px;">TIME</td><td style="padding: 8px 0; font-weight: 600;">${displayTime}</td></tr>
              <tr style="border-top: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #888; font-size: 13px;">FORMAT</td><td style="padding: 8px 0; font-weight: 600;">${meetingLabel}</td></tr>
              <tr style="border-top: 1px solid #f0f0f0;"><td style="padding: 8px 0; color: #888; font-size: 13px;">REFERENCE</td><td style="padding: 8px 0; font-family: monospace;">${reference}</td></tr>
            </table>
          </div>

          <p style="color: #555; font-size: 14px; margin: 0 0 16px;">
            Need to reschedule or have questions?
            <a href="mailto:${ADMIN_EMAIL}" style="color: #0066cc;">${ADMIN_EMAIL}</a>
          </p>
          ${BUSINESS_PHONE ? `<p style="color: #555; font-size: 14px; margin: 0 0 24px;">${escapeHtml(BUSINESS_PHONE)}</p>` : ''}
          <p style="color: #888; font-size: 13px; margin: 0;">
            ${escapeHtml(BUSINESS_NAME)}${BUSINESS_TAGLINE ? `<br>${escapeHtml(BUSINESS_TAGLINE)}` : ''}
          </p>
        </div>
      </div>
    `,
  });
}

async function sendAdminNotification({ firstName, lastName, email, phone, serviceName, bookingDate, startTime, endTime, meetingType, notes, reference }) {
  const meetingLabel = meetingType === 'phone' ? '📞 Phone Call' : '🤝 In Person';
  const displayDate = formatDisplayDate(bookingDate);
  const displayTime = `${formatTime(startTime)} – ${formatTime(endTime)}`;

  await resend.emails.send({
    from: `Booking System <${SEND_FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `New booking: ${firstName} ${lastName} — ${displayDate}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="background: #1a1a2e; color: #fff; margin: 0; padding: 20px 24px; border-radius: 8px 8px 0 0;">New Appointment Booked</h2>
        <div style="border: 1px solid #e0e0e0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background: #f9f9f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #888; width: 130px;">Client</td><td style="font-weight: 600;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            ${phone ? `<tr><td style="padding: 6px 0; color: #888;">Phone</td><td>${escapeHtml(phone)}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #888;">Service</td><td>${escapeHtml(serviceName)}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Date</td><td style="font-weight: 600;">${displayDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Time</td><td style="font-weight: 600;">${displayTime}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Format</td><td>${meetingLabel}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Reference</td><td style="font-family: monospace;">${reference}</td></tr>
            ${notes ? `<tr><td style="padding: 6px 0; color: #888; vertical-align: top;">Notes</td><td style="white-space: pre-wrap;">${escapeHtml(notes)}</td></tr>` : ''}
          </table>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;">
          <p style="margin: 0; font-size: 13px; color: #888;">Manage bookings at <a href="${SITE_URL}">${SITE_URL}</a></p>
        </div>
      </div>
    `,
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  if (isRateLimited(ip, 10)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { serviceId, date, startTime, meetingType, firstName, lastName, email, phone, notes, gdprConsent, honeypot } = req.body || {};

  if (honeypot) return res.status(400).json({ error: 'Invalid request' });

  if (!serviceId || !date || !startTime || !meetingType || !firstName || !lastName || !email || !gdprConsent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['phone', 'in_person'].includes(meetingType)) {
    return res.status(400).json({ error: 'Invalid meeting type' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  if (!/^\d{2}:\d{2}$/.test(startTime)) {
    return res.status(400).json({ error: 'Invalid time format' });
  }

  const sanitizedFirstName = validator.escape(validator.trim(firstName)).slice(0, 50);
  const sanitizedLastName = validator.escape(validator.trim(lastName)).slice(0, 50);
  const sanitizedEmail = validator.normalizeEmail(email) || email.toLowerCase();
  const sanitizedPhone = phone ? validator.escape(validator.trim(phone)).slice(0, 30) : null;
  const sanitizedNotes = notes ? validator.escape(validator.trim(notes)).slice(0, 1000) : null;

  try {
    const sql = getDb();

    const [service] = await sql`
      SELECT id, name, duration_minutes FROM services
      WHERE id = ${parseInt(serviceId, 10)} AND is_active = true
    `;
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const [sh, sm] = startTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = startMins + service.duration_minutes;
    const endTime = `${Math.floor(endMins / 60).toString().padStart(2, '0')}:${(endMins % 60).toString().padStart(2, '0')}`;

    const conflicts = await sql`
      SELECT id FROM bookings
      WHERE booking_date = ${date}
        AND status = 'confirmed'
        AND start_time < ${endTime}
        AND end_time > ${startTime}
    `;
    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'This time slot is no longer available. Please choose another.' });
    }

    const reference = generateReference();

    await sql`
      INSERT INTO bookings (
        reference, service_id, client_first_name, client_last_name,
        client_email, client_phone, booking_date, start_time, end_time,
        meeting_type, status, notes
      ) VALUES (
        ${reference}, ${service.id}, ${sanitizedFirstName}, ${sanitizedLastName},
        ${sanitizedEmail}, ${sanitizedPhone}, ${date}, ${startTime}, ${endTime},
        ${meetingType}, 'confirmed', ${sanitizedNotes}
      )
    `;

    const bookingData = {
      firstName: sanitizedFirstName, lastName: sanitizedLastName,
      email: sanitizedEmail, phone: sanitizedPhone,
      serviceName: service.name, bookingDate: date,
      startTime, endTime, meetingType, notes: sanitizedNotes, reference,
    };

    await Promise.all([
      sendClientConfirmation(bookingData),
      sendAdminNotification(bookingData),
    ]);

    syncToHubSpot(bookingData); // fire and forget

    return res.status(200).json({ success: true, reference, message: 'Booking confirmed' });
  } catch (error) {
    console.error('Booking create error:', error.message);
    return res.status(500).json({ error: 'Failed to create booking. Please try again.' });
  }
}

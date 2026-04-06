// POST /api/admin/login
// Body: { email, password }             → password login (primary)
// Body: { email, forgotPassword: true } → magic link fallback
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import { getDb, handleCors, isRateLimited } from '../_db.js';
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.SITE_URL || '';
const BUSINESS_NAME = process.env.BUSINESS_NAME || process.env.VITE_BUSINESS_NAME || 'Admin';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  if (isRateLimited(ip, 5, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { email, password, forgotPassword } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
  const isCorrectEmail = adminEmail && email.toLowerCase().trim() === adminEmail.toLowerCase().trim();

  // ── Password login ──────────────────────────────────────────────────────────
  if (password && !forgotPassword) {
    const hash = (process.env.ADMIN_PASSWORD_HASH || '').trim();
    if (!hash) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const checkHash = isCorrectEmail ? hash : '$2b$12$invalidhashfortimingprotectio.O8BnUHOL3JDcjDRjkfYVUFG3O2';
    const valid = await bcrypt.compare(password, checkHash);

    if (!isCorrectEmail || !valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
      const sql = getDb();
      const token = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await sql`DELETE FROM admin_sessions WHERE email = ${adminEmail}`;
      await sql`
        INSERT INTO admin_sessions (email, token, expires_at)
        VALUES (${adminEmail}, ${token}, ${expiresAt.toISOString()})
      `;

      const cookieOptions = [
        `admin_token=${token}`, 'HttpOnly', 'Secure', 'SameSite=Lax',
        `Max-Age=${7 * 24 * 60 * 60}`, 'Path=/',
      ].join('; ');

      res.setHeader('Set-Cookie', cookieOptions);
      const slug = process.env.VITE_ADMIN_SLUG || 'admin';
      return res.status(200).json({ success: true, redirect: `/${slug}/dashboard` });
    } catch (error) {
      console.error('Admin password login error:', error.message);
      return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  }

  // ── Magic link (forgot password fallback) ───────────────────────────────────
  if (!isCorrectEmail) {
    return res.status(200).json({ message: 'If that email is authorized, a login link has been sent.' });
  }

  try {
    const sql = getDb();
    const token = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await sql`DELETE FROM admin_sessions WHERE email = ${adminEmail}`;
    await sql`
      INSERT INTO admin_sessions (email, token, expires_at)
      VALUES (${adminEmail}, ${token}, ${expiresAt.toISOString()})
    `;

    const loginUrl = `${SITE_URL}/api/admin/verify?token=${token}`;

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${(process.env.SEND_FROM_EMAIL || adminEmail).trim()}>`,
      to: adminEmail,
      subject: 'Your admin login link',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #1a1a2e; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <p style="color: #fff; margin: 0; font-weight: bold;">${BUSINESS_NAME}</p>
          </div>
          <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
            <h2 style="margin: 0 0 16px;">Admin Login Link</h2>
            <p style="color: #555; margin: 0 0 24px;">Click below to log in. This link expires in <strong>30 minutes</strong>.</p>
            <a href="${loginUrl}" style="display: inline-block; background: #1a1a2e; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">Log In to Dashboard</a>
            <p style="color: #999; font-size: 12px; margin: 24px 0 0;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ message: 'If that email is authorized, a login link has been sent.' });
  } catch (error) {
    console.error('Admin magic link error:', error.message);
    return res.status(500).json({ error: 'Failed to send login link' });
  }
}

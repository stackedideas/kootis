// Shared Neon database client, CORS handler, and rate limiter
import { neon } from '@neondatabase/serverless';

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

// Derive allowed origins from SITE_URL env var
function getAllowedOrigins() {
  const url = (process.env.SITE_URL || '').replace(/\/$/, '');
  if (!url) return [];
  const wwwVersion = url.replace('https://', 'https://www.').replace('http://', 'http://www.');
  return [url, wwwVersion];
}

export function handleCors(req, res) {
  const origin = req.headers.origin;
  if (getAllowedOrigins().includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

// Simple in-memory rate limiter (resets on cold start)
const rateLimitMap = new Map();
export function isRateLimited(ip, maxRequests = 20, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count > maxRequests;
}

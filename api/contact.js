import { createDb } from '../server/src/db.js';
import { ContactSchema } from '../server/src/validators/contact.js';
import { sendContactEmail } from '../server/src/email.js';

// Vercel Serverless Function (Node runtime)
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }

    // body parsing: Vercel usually gives req.body already for JSON requests
    const parsed = ContactSchema.safeParse(req.body || {});
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input.', details: parsed.error.flatten() });
      return;
    }

    const { name, email, message, hp_field } = parsed.data;

    // Honeypot anti-spam
    if (hp_field && hp_field.trim() !== '') {
      res.status(200).json({ ok: true });
      return;
    }

    if (message.length < 5) {
      res.status(400).json({ error: 'Message too short.' });
      return;
    }

    const db = createDb();

    const userIp = (req.headers['x-forwarded-for'] || '').toString().split(',')[0]?.trim() || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent']?.toString()?.slice(0, 512) || null;

    await db.query(
      `INSERT INTO messages (name, email, message, user_ip, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, message, userIp, userAgent]
    );

    await sendContactEmail({ name, email, message });

    res.status(200).json({ ok: true, message: 'Message received.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process contact request.' });
  }
}


import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { ContactSchema } from './validators/contact.js';
import { createDb } from './db.js';
import { sendContactEmail } from './email.js';
import { serveResumePdf } from './resume.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan('tiny'));
  app.use(express.json({ limit: '256kb' }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const db = createDb();

  app.get('/health', (req, res) => res.json({ ok: true }));

  app.get('/api/resume', (req, res) => {
    serveResumePdf(req, res);
  });

  app.post('/api/contact', limiter, async (req, res) => {
    try {
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

      // Basic server-side content checks
      if (message.length < 5) {
        res.status(400).json({ error: 'Message too short.' });
        return;
      }

      // Store in Neon Postgres
      const userIp = req.headers['x-forwarded-for']?.toString()?.split(',')[0]?.trim() || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent']?.toString()?.slice(0, 512) || null;

      await db.query(
        `INSERT INTO messages (name, email, message, user_ip, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [name, email, message, userIp, userAgent]
      );

      // Send email notification
      await sendContactEmail({ name, email, message });

      res.json({ ok: true, message: 'Message received.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process contact request.' });
    }
  });

  return app;
}


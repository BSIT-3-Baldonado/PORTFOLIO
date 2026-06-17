-- messages table for contact form submissions
-- Use with Neon Postgres

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  message TEXT NOT NULL,
  user_ip VARCHAR(64),
  user_agent VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


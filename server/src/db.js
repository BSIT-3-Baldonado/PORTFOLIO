import pg from 'pg';

export function createDb() {
  const { Pool } = pg;
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' || process.env.DATABASE_URL?.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : undefined,
  });
}


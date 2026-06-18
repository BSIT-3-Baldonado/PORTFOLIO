# TODO

## Contact form → DB + email
- [x] Verify frontend submits JSON payload with name/email/message/hp_field to `POST /api/contact`.

- [x] Ensure `messages` table exists (migration `server/migrations/001_create_messages.sql`).

- [x] Ensure contact endpoint inserts a row into `messages` and returns success.

- [x] Ensure owner email is sent to Kengabriel110720@gmail.com (SMTP env vars + defaults).

- [x] Provide setup instructions: database migration + environment variables.



